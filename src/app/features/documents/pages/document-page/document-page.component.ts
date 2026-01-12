import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Tooltip } from 'bootstrap';

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
import { HttpClient } from "@angular/common/http";



@Component({
    selector: 'document-page',
    standalone: true,
    imports: [FormsModule],
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

    charCount: number = 0;
    wordCount: number = 0;

    constructor(private cdr: ChangeDetectorRef, private http: HttpClient) {
    }

    ngOnInit(): void {
        this.ydoc = new Y.Doc();
        this.pendingUpdates = []

        this.ydoc.on('update', (update: Uint8Array, origin) => {
            if (origin === this.provider) return;
            this.pendingUpdates.push(update);
        });

        this.provider = new HocuspocusProvider({
            url: 'ws://localhost:1234',
            name: 'demo-doc-me-1',
            document: this.ydoc
        });

        this.flushInterval = setInterval(() => {
            if (this.pendingUpdates.length === 0) return

            const payload = {
                documentId: 112233,
                updates: this.pendingUpdates.map(u => this.uint8ToBase64(u))
            }
            
            this.http.post('/api/update', payload).subscribe({
                next: () => this.pendingUpdates = [],
                error: err => {
                    console.error('ZZZ Faieled');
                }
            });
        }, 5000)
    }

    ngAfterViewInit(): void {

        //Tooltip
        const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.forEach(el => new Tooltip(el));

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

    // base64ToUint8(base64: string): Uint8Array {
    //     const binary = atob(base64)
    //     const bytes = new Uint8Array(binary.length)
    //     for (let i = 0; i < binary.length; i++) {
    //         bytes[i] = binary.charCodeAt(i)
    //     }
    //     return bytes
    // }

    ngOnDestroy(): void {
        this.editor?.destroy();
        this.provider?.destroy();
        this.ydoc?.destroy();
        if (this.flushInterval) {
            clearInterval(this.flushInterval)
        }
    }
}