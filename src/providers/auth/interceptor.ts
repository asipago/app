import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpResponse, HttpErrorResponse, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';

import { Storage } from "@ionic/storage";
import { Observable } from 'rxjs';

import { DataProvider } from '@providers/data/data';
import { SERVER_URL, TOKEN_NAME, SERVER_GEO_API, DOCUMENT_NAME } from '@app/config';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        public storage: Storage,
        public dataProvider: DataProvider
    ) { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        const httpRequest = Observable.fromPromise(this.getValues()).map(values => {
            const idToken = values.token;

            const current_document = values.document;
            const current_currency = this.dataProvider.getCurrency();

            const needToken = req.url.search(`${SERVER_GEO_API}`) === -1 &&
                req.url !== `${SERVER_URL}/auth/login/app` &&
                req.url !== `${SERVER_URL}/users`;
    
            if (idToken && needToken) {// && req.url.indexOf("api.asipago.com") > -1) {
                let params = req.params;
                if (!req.params.get('user_document') && !req.body) {
                    params = params.append('user_document', current_document);
                    params = params.append('user_currency', current_currency);
                }
    
                let body = req.body;
                if (req.body) {
                    body.user_document = current_document;
                    body.user_currency = current_currency;
                }
    
                return req.clone(req.method == "GET" ? {
                    params: params,
                    headers: req.headers.set("Authorization", "Bearer " + idToken)
                } : {
                    body: body,
                    headers: req.headers.set("Authorization", "Bearer " + idToken)
                });
            } else {
                return req;
            }
        });
        
        return httpRequest.mergeMap((req) => {
            return next.handle(req).do((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // console.log("response ok");
                }
            }, (err: any) => {
                if (err instanceof HttpErrorResponse) {
                    switch(err.status) {
                        case 401: default:
                            // console.log("error");
                        break;
                    }
                }
            });
        });
    }

    getValues() {
        return this.storage.get(`${TOKEN_NAME}`).then(token => {
            return this.storage.get(`${DOCUMENT_NAME}`).then(document => {
                return { token: token, document: document };
            })
        });
    }
}