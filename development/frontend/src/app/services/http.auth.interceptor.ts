import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';

import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { map, catchError, take } from 'rxjs/operators';
import { UserService } from "./user/user.service";
import { SessionManagement } from '../utilities/session_management';
import { BaseService } from './base.service';
import { LoginComponent } from '../pages/login/login.component';
import { JWTHelper } from '../utilities/jwt';

@Injectable()
export class HttpAuthorizationInterceptor implements HttpInterceptor {
    isRefreshingToken: boolean = false;
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    constructor(private userService: UserService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let request = null;
        let session = new SessionManagement()
        request = req.clone({ setHeaders: { Authorization: 'Bearer ' + session.getAcToken() } });

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                if (error instanceof HttpErrorResponse) {
                    switch ((<HttpErrorResponse>error).status) {
                        case 401:
                            this.userService.logout();
                            return throwError("401");
                        case 403:
                            return throwError(error);
                        default:
                            return throwError(error);
                    }
                }

            }))

    }


   


}