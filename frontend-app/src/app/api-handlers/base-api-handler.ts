import { AuthService } from './../services/auth.service';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';

import { Observable } from 'rxjs/Observable';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpResponseBase, HttpErrorResponse } from '@angular/common/http';
import { SwaggerException, FileResponse, throwException, blobToText } from './tools';
import { TagPlaceholder } from '@angular/compiler/src/i18n/i18n_ast';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

export class BaseApiHandler {
    private http: HttpClient;
    private baseUrl: string;
    private headers: HttpHeaders;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(private authService: AuthService,
        http: HttpClient,
        baseUrl: string,
        headers: HttpHeaders) {
        this.http = http;
        this.baseUrl = baseUrl;
        this.headers = headers;
    }

    /**
     * Get all records from database
     * 
     * @template T: DTO that we expect
     * @returns {(Observable<T[] | null>)} 
     * @memberof BaseApiHandler
     */
    getMany<T>(additionToBaseURL?: string, parametersToReplace?: {}): Observable<T[] | null> {
        //TODO: zabezpieczyc przed sytuacja zapomnienia o \
        let url_ = this.baseUrl;
        if(additionToBaseURL){
            url_ += additionToBaseURL;
        }
        url_ = url_.replace(/[?&]$/, "");
        for (let key in parametersToReplace) {
            let paramInURL = "{" + key + "}";
            var re = new RegExp("\{" + key + "\}", "g");
            url_ = url_.replace(re, parametersToReplace[key]);
        }

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: this.headers
        };

        return this.http.request("get", url_, options_).flatMap((response_: any) => {
            return this.processGetMany<T>(response_);
        }).catch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetMany<T>(<any>response_);
                } catch (e) {
                    return <Observable<T[] | null>><any>Observable.throw(e);
                }
            } else
                return <Observable<T[] | null>><any>Observable.throw(response_);
        });
    }

    /**
     * Receives object with data from server, converts it to DTO
     * Needs to be overriden by subclasses
     * 
     * @protected
     * @param {*} data 
     * @memberof BaseApiHandler
     */
    protected fromJsConversion(data: any): any {
        throw new Error('fromJsConversion not implemented');
    }

    protected processGetMany<T>(response: HttpResponseBase): Observable<T[] | null> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); } };
        if (status === 200) {
            return blobToText(responseBlob).flatMap(_responseText => {
                let result200: any = null;
                let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                if (resultData200 && resultData200.constructor === Array) {
                    result200 = [];
                    for (let item of resultData200)
                        result200.push(this.fromJsConversion(item));
                }
                return Observable.of(result200);
            });
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).flatMap(_responseText => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Observable.of<T[] | null>(<any>null);
    }

    post<T>(dto: T | null): Observable<FileResponse | null> {
        let url_ = this.baseUrl;
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(dto);

        let options_: any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: this.headers
        };

        return this.http.request("post", url_, options_).flatMap((response_: any) => {
            return this.processPost(response_);
        }).catch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processPost(<any>response_);
                } catch (e) {
                    return <Observable<FileResponse | null>><any>Observable.throw(e);
                }
            } else
                return <Observable<FileResponse | null>><any>Observable.throw(response_);
        });
    }

    protected processPost(response: HttpResponseBase): Observable<FileResponse | null> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); } };
        if (status === 200 || status === 206) {
            const contentDisposition = response.headers ? response.headers.get("content-disposition") : undefined;
            const fileNameMatch = contentDisposition ? /filename="?([^"]*?)"?(;|$)/g.exec(contentDisposition) : undefined;
            const fileName = fileNameMatch && fileNameMatch.length > 1 ? fileNameMatch[1] : undefined;
            return Observable.of({ fileName: fileName, data: <any>responseBlob, status: status, headers: _headers });
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).flatMap(_responseText => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Observable.of<FileResponse | null>(<any>null);
    }

    get<T>(id: number): Observable<T | null> {
        let url_ = this.baseUrl + "/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            //responseType: "blob",
            headers: this.headers
        };

        return this.http.request("get", url_, options_).flatMap((response_: any) => {
            return this.processGet<T>(response_);
        }).catch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGet<T>(<any>response_);
                } catch (e) {
                    return <Observable<T | null>><any>Observable.throw(e);
                }
            } else
                return <Observable<T | null>><any>Observable.throw(response_);
        });
    }

    protected processGet<T>(response: HttpResponseBase): Observable<T | null> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        // let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        // if (status === 200 || status === 206) {
        //     const contentDisposition = response.headers ? response.headers.get("content-disposition") : undefined;
        //     const fileNameMatch = contentDisposition ? /filename="?([^"]*?)"?(;|$)/g.exec(contentDisposition) : undefined;
        //     const fileName = fileNameMatch && fileNameMatch.length > 1 ? fileNameMatch[1] : undefined;
        //     return Observable.of({ fileName: fileName, data: <any>responseBlob, status: status, headers: _headers });
        // } else if (status !== 200 && status !== 204) {
        //     return blobToText(responseBlob).flatMap(_responseText => {
        //     return throwException("An unexpected server error occurred.", status, _responseText, _headers);
        //     });
        // }
        // return Observable.of<FileResponse | null>(<any>null);

        if (status == 200) {
            const resultData200 = response instanceof HttpResponse ? response.body : undefined;
            //let resultData200 = result === "" ? null : JSON.parse(result, this.jsonParseReviver);
            if (resultData200) {
                return Observable.of(this.fromJsConversion(resultData200));
            }
        }

        return Observable.of<T | null>(<any>null);
    }

    put<T>(id: number, dto: T | null): Observable<FileResponse | null> {
        let url_ = this.baseUrl + "/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(dto);

        let options_: any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: this.headers
        };

        return this.http.request("put", url_, options_).flatMap((response_: any) => {
            return this.processPut(response_);
        }).catch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processPut(<any>response_);
                } catch (e) {
                    return <Observable<FileResponse | null>><any>Observable.throw(e);
                }
            } else
                return <Observable<FileResponse | null>><any>Observable.throw(response_);
        });
    }

    protected processPut(response: HttpResponseBase): Observable<FileResponse | null> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); } };
        if (status === 200 || status === 206) {
            const contentDisposition = response.headers ? response.headers.get("content-disposition") : undefined;
            const fileNameMatch = contentDisposition ? /filename="?([^"]*?)"?(;|$)/g.exec(contentDisposition) : undefined;
            const fileName = fileNameMatch && fileNameMatch.length > 1 ? fileNameMatch[1] : undefined;
            return Observable.of({ fileName: fileName, data: <any>responseBlob, status: status, headers: _headers });
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).flatMap(_responseText => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Observable.of<FileResponse | null>(<any>null);
    }

    delete(id: number): Observable<FileResponse | null> {
        let url_ = this.baseUrl + "/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: this.headers
        };

        return this.http.request("delete", url_, options_).flatMap((response_: any) => {
            return this.processDelete(response_);
        }).catch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDelete(<any>response_);
                } catch (e) {
                    return <Observable<FileResponse | null>><any>Observable.throw(e);
                }
            } else
                return <Observable<FileResponse | null>><any>Observable.throw(response_);
        });
    }

    protected processDelete(response: HttpResponseBase): Observable<FileResponse | null> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); } };
        if (status === 200 || status === 206) {
            const contentDisposition = response.headers ? response.headers.get("content-disposition") : undefined;
            const fileNameMatch = contentDisposition ? /filename="?([^"]*?)"?(;|$)/g.exec(contentDisposition) : undefined;
            const fileName = fileNameMatch && fileNameMatch.length > 1 ? fileNameMatch[1] : undefined;
            return Observable.of({ fileName: fileName, data: <any>responseBlob, status: status, headers: _headers });
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).flatMap(_responseText => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Observable.of<FileResponse | null>(<any>null);
    }
}