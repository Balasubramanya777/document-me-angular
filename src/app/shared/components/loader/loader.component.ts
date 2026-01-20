import { Component, Input } from "@angular/core";
import { AnimationItem } from "lottie-web";
import { AnimationOptions, LottieComponent } from 'ngx-lottie';

@Component({
    selector: 'loader',
    standalone: true,
    imports: [LottieComponent],
    template: `<ng-lottie [options]="options1" />`
})

export class Loader {

    @Input() active = false;

    options1: AnimationOptions = {
        path: '/assets/lottie/loading1.json',
    };

}