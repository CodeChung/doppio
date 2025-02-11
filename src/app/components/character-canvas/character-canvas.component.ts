import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterService } from '../../services/character.service';

@Component({
  selector: 'app-character-canvas',
  standalone: true, // ✅ Mark as standalone
  imports: [CommonModule], // ✅ Import necessary modules directly
  templateUrl: './character-canvas.component.html',
  styleUrls: ['./character-canvas.component.scss'],
})
export class CharacterCanvasComponent implements OnInit, AfterViewInit {
  frames = ['assets/villager/PNG_Sequences/Idle_Blinking/0_Zombie_Villager_Idle_Blinking_000.png'
  ];
  currentFrameIndex = 0;
  currentFrame = this.frames[this.currentFrameIndex];
  currentAnimationType = 'idle_blinking';
  showDefault: boolean = true;

  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  constructor(private characterService: CharacterService) { }

  ngOnInit(): void {
    this.loadRandomIdleFrames(true);

    let repeats = this.getRandomInt(7);
    setInterval(() => {
      this.currentFrameIndex = (this.currentFrameIndex + 1) % this.frames.length;
      this.currentFrame = this.frames[this.currentFrameIndex];
      if (this.currentFrameIndex == 0) {
        repeats--;
        console.log('rep')
        if (repeats < 0) {
          if (this.showDefault) {
            repeats = this.getRandomInt(7);
            this.loadRandomIdleFrames(true);
          } else {
            repeats = 1;
            this.loadRandomIdleFrames();
          }
          this.showDefault = !this.showDefault;
        }
      }

    }, 80)
  }

  ngAfterViewInit(): void {
    // const canvas = this.canvasRef.nativeElement;
    // this.ctx = canvas.getContext('2d')!;
    // this.animate();
  }

  getRandomInt(maxNum: number) {
    return Math.floor(Math.random() * (maxNum + 1));
  }

  loadRandomIdleFrames(isFirstLoad: boolean = false) {
    const idleTypes = ['idle_blinking', 'sliding', 'kicking', 'hurt', 'throwing'];
    let idleType = idleTypes[this.getRandomInt(idleTypes.length - 1)]
    const frames = [];
    let path;
    let count = 0;
    switch (idleType) {
      case ('idle_blinking'):
        path = 'Idle_Blinking/0_Zombie_Villager_Idle_Blinking_';
        count = 17;
        break;
      case ('sliding'):
        path = 'Sliding/0_Zombie_Villager_Sliding_';
        count = 5;
        break;
      case ('running'):
        path = 'Running/0_Zombie_Villager_Running_';
        count = 11;
        break;
      case ('kicking'):
        path = 'Kicking/0_Zombie_Villager_Kicking_';
        count = 11;
        break;
      case ('hurt'):
        path = 'Hurt/0_Zombie_Villager_Hurt_';
        count = 11;
        break;
      case ('throwing'):
        path = 'Throwing/0_Zombie_Villager_Throwing_';
        count = 11;
        break;
      default:
        path = 'Idle_Blinking/0_Zombie_Villager_Idle_Blinking_';
        count = 17;
        break;
    }

    if (isFirstLoad) {
      path = 'Idle_Blinking/0_Zombie_Villager_Idle_Blinking_';
    }

    for (let i = 0; i <= count; i++) {
      if (i < 10) {
        frames.push(`assets/villager/PNG_Sequences/${path}00${i}.png`);
      } else {
        frames.push(`assets/villager/PNG_Sequences/${path}0${i}.png`);
      }
    }
    this.frames = frames;
  }
}
