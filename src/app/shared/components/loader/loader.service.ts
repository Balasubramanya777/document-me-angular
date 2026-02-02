import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class LoaderService {

    private count = 0;
    private _loading = signal(false);
    loading = this._loading.asReadonly();

    show() {
        if (++this.count === 1) {
            this._loading.set(true);
        }
    }

    hide() {
        if (this.count > 0 && --this.count === 0) {
            this._loading.set(false);
        }
    }

}