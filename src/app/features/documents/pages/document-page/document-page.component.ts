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
import { EditorComponent } from "../editor/editor.component";
import { DocumentService } from "../../services/document.service";
import { take } from "rxjs";
import { ContentCreateDto, ContentDto } from "../../models/document.models";
import { ApiResponse } from "../../../auth/models/api.response.model";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatDividerModule } from '@angular/material/divider';



@Component({
    selector: 'document-page',
    standalone: true,
    imports: [FormsModule, EditorComponent, ReactiveFormsModule, MatIconModule, MatToolbarModule, MatDividerModule],
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
            console.error("No idddd");
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
        });


        this.documentService.getContent(this.documentId).subscribe({
            next: (res: ApiResponse<ContentDto>) => {
                if (res.success) {
                    this.form.setValue({
                        documentId: res.data.documentId,
                        title: res.data.title
                    });

                    res.data.updates.forEach(arr => {
                        const binary = Uint8Array.from(atob(arr), x => x.charCodeAt(0));
                        Y.applyUpdate(this.ydoc, binary);
                    });
                }
            }
        })

        // this.flushInterval = setInterval(() => {
        //     if (this.pendingUpdates.length === 0) return

        //     const payload: ContentCreateDto = {
        //         documentId: this.documentId,
        //         updates: this.pendingUpdates.map(u => this.uint8ToBase64(u))
        //     }

        //     this.documentService.createContent(payload).subscribe({
        //         next: () => this.pendingUpdates = [],
        //         error: err => {
        //             console.error('ZZZ Faieled');
        //         }
        //     });
        // }, 10000)
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
        this.editor?.destroy();
        this.provider?.destroy();
        this.ydoc?.destroy();
        if (this.flushInterval) {
            clearInterval(this.flushInterval)
        }
    }

    back() {
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
}