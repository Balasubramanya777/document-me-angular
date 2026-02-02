import { Component, Input } from "@angular/core";
import { AnimationOptions, LottieComponent } from 'ngx-lottie';

@Component({
    selector: 'loader',
    standalone: true,
    imports: [LottieComponent],
    template: `
    @if (active) {
      <div class="overlay">
        <ng-lottie [options]="option"></ng-lottie>
      </div>
    }
  `,
    styles: [`
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(255, 255, 255, 0.7);
      z-index: 10000;

      display: flex;
      justify-content: center;
      align-items: center;
    }
  `]
})

export class Loader {

    @Input({ required: true }) active!: boolean;

    option: AnimationOptions = {
        path: '/assets/lottie/document_loading.json',
        loop: true,
        autoplay: true,
    };

}