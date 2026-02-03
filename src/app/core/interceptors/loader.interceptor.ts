import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { finalize } from "rxjs";
import { LoaderService } from "../../shared/components/loader/loader.service";
import { SKIP_LOADER } from "../http-context/loader.context";

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

    private loader = inject(LoaderService);

    intercept(req: HttpRequest<any>, next: HttpHandler) {

        if (req.context.get(SKIP_LOADER)) {
            return next.handle(req);
        }

        this.loader.show();
        return next.handle(req).pipe(
            finalize(() => this.loader.hide())
        );
    }

}