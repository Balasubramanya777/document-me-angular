import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";

import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Focus from '@tiptap/extension-focus';

import * as Y from 'yjs';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCaret from '@tiptap/extension-collaboration-caret'
import { HocuspocusProvider } from '@hocuspocus/provider'
import { ActivatedRoute, Router } from "@angular/router";
import { DocumentService } from "../../services/document.service";
import { ContentCreateDto, ContentDto, DocumentUpsertDto } from "../../models/document.models";
import { ApiResponse } from "../../../auth/models/api.response.model";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatDividerModule } from '@angular/material/divider';


@Component({
    selector: 'document-page',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, MatIconModule, MatToolbarModule, MatDividerModule],
    templateUrl: './document-page.component.html',
    styleUrls: ['./document-page.component.scss']
})
export class DocumentPage implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('editor') editorEl!: ElementRef<HTMLDivElement>;
    editor!: Editor;

    private ydoc!: Y.Doc;
    private provider!: HocuspocusProvider;
    private pendingUpdates!: Uint8Array[];
    private flushInterval!: number
    private documentId!: number;

    charCount: number = 0;
    wordCount: number = 0;
    private totalUpdateCount = 0;
    private totalUpdateSize = 0;
    private flushing = false;

    private activatedRoute = inject(ActivatedRoute)
    private route = inject(Router);
    private cdr = inject(ChangeDetectorRef);
    private documentService = inject(DocumentService);
    private fb = inject(FormBuilder);

    form: FormGroup = this.fb.group({
        documentId: ['', [Validators.required]],
        title: ['', [Validators.required]],
    });

    ngOnInit(): void {
        const idParam = this.activatedRoute.snapshot.paramMap.get('id');
        if (!idParam) {
            this.route.navigate(['/documents']);
            return;
        }

        this.documentId = Number(idParam);
        this.ydoc = new Y.Doc();
        this.pendingUpdates = []

        this.provider = new HocuspocusProvider({
            url: 'ws://localhost:1234',
            name: `doc-me-${this.documentId}`,
            document: this.ydoc
        });

        this.ydoc.on('update', (update: Uint8Array, origin) => {
            if (origin === this.provider) return;
            this.pendingUpdates.push(update);
            this.totalUpdateCount++;
            this.totalUpdateSize += update.byteLength;
        });


        this.documentService.getContent(this.documentId).subscribe({
            next: (res: ApiResponse<ContentDto>) => {
                if (res.success) {
                    this.form.setValue({
                        documentId: res.data.documentId,
                        title: res.data.title
                    });

                    if (res.data.snapshot) {
                        const snapshotBinary = Uint8Array.from(atob(res.data.snapshot), c => c.charCodeAt(0));
                        Y.applyUpdate(this.ydoc, snapshotBinary);
                    }

                    res.data.updates?.forEach(arr => {
                        const binary = Uint8Array.from(atob(arr), x => x.charCodeAt(0));
                        Y.applyUpdate(this.ydoc, binary);
                    });
                }
            }
        });

        this.flushInterval = setInterval(() => this.flushNow(), 10000);

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.flushNow();
            }
        });
    }

    flushNow(): Promise<void> {
        if (this.flushing || this.pendingUpdates.length === 0) return Promise.resolve();

        this.flushing = true;
        const updatesToSend = this.pendingUpdates;
        this.pendingUpdates = [];

        const mergedUpdates = Y.mergeUpdates(updatesToSend);
        const createSnapshot = this.shouldCreateSnapshot();

        let payload: ContentCreateDto;

        if (createSnapshot) {
            payload = {
                documentId: this.documentId,
                snapshot: this.createSnapshot()
            };
        } else {
            payload = {
                documentId: this.documentId,
                updates: [this.uint8ToBase64(mergedUpdates)]
            };
        }

        return new Promise((resolve) => {
            this.documentService.createContent(payload).subscribe({
                next: () => {
                    if (createSnapshot) {
                        this.totalUpdateCount = 0;
                        this.totalUpdateSize = 0;
                        this.pendingUpdates = [];
                    }
                    this.flushing = false;
                    resolve();
                }
                ,
                error: err => {
                    //ROLLBACK -> put updates back in buffer
                    this.pendingUpdates.unshift(...updatesToSend);

                    // rollback counters
                    updatesToSend.forEach(u => {
                        this.totalUpdateCount--;
                        this.totalUpdateSize -= u.byteLength;
                    });
                    this.flushing = false;
                    resolve();
                }
            });
        });
    }

    private shouldCreateSnapshot(): boolean {
        return (
            this.totalUpdateCount >= 50 ||
            this.totalUpdateSize >= 1024 * 1024 // 1 MB
        );
    }

    private createSnapshot(): string {
        const fullState = Y.encodeStateAsUpdate(this.ydoc);
        return this.uint8ToBase64(fullState);
    }

    ngAfterViewInit(): void {

        //Tiptap
        this.editor = new Editor({
            element: this.editorEl.nativeElement,
            extensions: [
                StarterKit.configure({
                    history: false,
                } as any),
                Collaboration.configure({
                    document: this.ydoc,
                }),
                // CollaborationCaret.configure({
                //     provider: this.provider,
                //     user: {
                //         // name: 'Arjun Reddy',
                //         color: '#0d6efd',
                //     },
                // }),
                Underline,
                Highlight,
                CharacterCount,
                Placeholder.configure({
                    placeholder: 'Start typing…',
                }),
                Focus.configure({
                    className: 'has-focus',
                    mode: 'all',
                }),
            ],
            onUpdate: ({ editor }) => {
                this.updateCounts(editor);
            },
        });

        this.editor.view.dispatch(this.editor.state.tr);
        this.updateCounts(this.editor);
    }

    toggleBold() {
        this.editor.chain().focus().toggleBold().run();
    }

    toggleItalic() {
        this.editor.chain().focus().toggleItalic().run();
    }

    toggleUnderline() {
        this.editor.chain().focus().toggleUnderline().run();
    }

    toggleStrike() {
        this.editor.chain().focus().toggleStrike().run();
    }

    toggleHighlight() {
        this.editor.chain().focus().toggleHighlight().run();
    }

    toggleBulletList() {
        this.editor.chain().focus().toggleBulletList().run();
    }

    toggleOrderedList() {
        this.editor.chain().focus().toggleOrderedList().run();
    }

    isActive(type: string): boolean {
        return this.editor?.isActive(type) ?? false;
    }

    updateCounts(editor: Editor) {
        this.charCount = editor.storage.characterCount.characters();
        this.wordCount = editor.storage.characterCount.words();
        this.cdr.detectChanges();
    }

    uint8ToBase64(bytes: Uint8Array): string {
        let binary = '';
        bytes.forEach(b => binary += String.fromCharCode(b))
        return btoa(binary)
    }

    ngOnDestroy(): void {
        this.flushNow();
        this.editor?.destroy();
        this.provider?.destroy();
        this.ydoc?.destroy();
        if (this.flushInterval) {
            clearInterval(this.flushInterval)
        }
    }

    async back() {
        await this.flushNow();
        this.route.navigate(['/documents']);
    }

    focusEditor(event: MouseEvent) {
        event.stopPropagation();
        if (this.editor) {
            this.editor.chain().focus().run();
        } else {
            // Fallback if editor not initialized yet
            const proseMirror = this.editorEl.nativeElement.querySelector('.ProseMirror') as HTMLElement;
            proseMirror?.focus();
        }
    }

    onTitleBlur() {
        const title = this.form.controls['title'].value;
        const control = this.form.get('title');

        if (title !== null && title.trim() !== '') {
            const payload: DocumentUpsertDto = {
                documentId: this.documentId,
                title: this.form.controls['title'].value
            }
            this.documentService.updateDocument(payload).subscribe({
                next: () => {
                    this.editor?.setEditable(true);
                    control?.setErrors(null);
                },
                error: (err) => {
                    this.editor?.setEditable(false);
                    control?.setErrors({ errorMessage: err.error.message });
                    control?.markAsTouched();
                }
            })
        }
    }
}