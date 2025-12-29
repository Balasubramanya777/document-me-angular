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

    charCount: number = 0;
    wordCount: number = 0;

    constructor(private cdr: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.ydoc = new Y.Doc();

        this.provider = new HocuspocusProvider({
            url: 'ws://localhost:1234',
            name: 'demo-doc-me-1',
            document: this.ydoc
        });
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


    ngOnDestroy(): void {
        this.editor?.destroy();
        this.provider?.destroy();
        this.ydoc?.destroy();
    }
}