import { NgFor, NgIf, } from '@angular/common';
import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import EditorJS from '@editorjs/editorjs';
import EditorjsList from '@editorjs/list';
import Marker from '@editorjs/marker';

import { CharacterCanvasComponent } from './components/character-canvas/character-canvas.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor, NgIf, CharacterCanvasComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('editor') editorRef!: ElementRef;
  editor!: EditorJS;

  journalEntries: { date: string; content: any }[] = JSON.parse(localStorage.getItem('entries') || '[]');
  activeTab: 'home' | 'recent' | 'settings' = 'home';
  sidebarOpen = true;
  currentDate = new Date().toLocaleDateString();

  ngAfterViewInit() {
    this.editor = new EditorJS({
      holder: this.editorRef.nativeElement,
      placeholder: "Start writing your journal...",
      onChange: () => this.saveContent(),
      tools: {
        list: EditorjsList,
        marker: {
          class: Marker,
          shortcut: 'CMD+SHIFT+M',
        },
      }
    });
  }

  async saveContent() {
    const content = await this.editor.save();
    localStorage.setItem('draft', JSON.stringify(content));
  }

  async addEntry() {
    const content = await this.editor.save();
    this.journalEntries.push({ date: new Date().toLocaleDateString(), content });
    localStorage.setItem('entries', JSON.stringify(this.journalEntries));
    this.editor.clear();
  }

  deleteEntry(index: number) {
    this.journalEntries.splice(index, 1);
    localStorage.setItem('entries', JSON.stringify(this.journalEntries));
  }
}
