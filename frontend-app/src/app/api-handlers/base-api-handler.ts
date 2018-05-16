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
        let url_ = this.prepareApiUrl(additionToBaseURL, parametersToReplace);

        let options_: any = {
            observe: "response",
            headers: this.headers
        };

        return this.http.request("get", url_, options_).flatMap((response_: any) => {
            return this.processGetMany<T>(response_);
        }).catch((response_: any) => {
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

        if (status === 200) {
            let result200;
            let resultData200 = response instanceof HttpResponse ? response.body : undefined;
            if (resultData200 && resultData200.constructor === Array) {
                result200 = [];
                for (let item of resultData200)
                    result200.push(this.fromJsConversion(item));
            }
            return Observable.of(result200);
        } else {
            throw Error("Something went wrong");
        }
    }

    post<T>(dto: T | null): Observable<T | null> {
        return this.postWithUrlAddition(dto, "");
    }

    postWithUrlAddition<T>(dto: T | null, additionToUrl: string): Observable<T | null> {
        let url_ = this.baseUrl;
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(dto);

        let options_: any = {
            body: content_,
            observe: "response",
            headers: this.headers
        };

        return this.http.request("post", url_, options_).flatMap((response_: any) => {
            return this.processPost<T>(response_);
        }).catch((response_: any) => {
            return <Observable<T | null>><any>Observable.throw(response_);
        });
    }

    protected processPost<T>(response: HttpResponseBase): Observable<T | null> {
        const status = response.status;

        if (status == 201) {
            const resultData200 = response instanceof HttpResponse ? response.body : undefined;

            if (resultData200) {
                return Observable.of(this.fromJsConversion(resultData200));
            }
        }
        else {
            throw "Object not created";
        }
        return Observable.of<T | null>(<any>null);
    }

    getWithId<T>(id: number): Observable<T | null> {
        return this.get<T>("/{id}", {
            "id": id
        });
    }

    get<T>(additionToBaseURL?: string, parametersToReplace?: {}): Observable<T | null> {
        let url_ = this.prepareApiUrl(additionToBaseURL, parametersToReplace);

        let options_: any = {
            observe: "response",
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

        if (status == 200) {
            const resultData200 = response instanceof HttpResponse ? response.body : undefined;
            //let resultData200 = result === "" ? null : JSON.parse(result, this.jsonParseReviver);
            if (resultData200) {
                return Observable.of(this.fromJsConversion(resultData200));
            }
        }

        return Observable.of<T | null>(<any>null);
    }

    putWithId<T>(id: number, dto: T | null): Observable<T | null> {
        return this.put<T>(dto, "/{id}", {
            "id": id
        });
    }

    put<T>(dto: T | null, additionToBaseURL?: string, parametersToReplace?: {}): Observable<T | null> {
        let url_ = this.prepareApiUrl(additionToBaseURL, parametersToReplace);

        const content_ = JSON.stringify(dto);

        let options_: any = {
            body: content_,
            observe: "response",
            headers: this.headers
        };

        return this.http.request("put", url_, options_).flatMap((response_: any) => {
            return this.processPut<T>(response_);
        }).catch((response_: any) => {
            return <Observable<T | null>><any>Observable.throw(response_);
        });
    }

    protected processPut<T>(response: HttpResponseBase): Observable<T | null> {
        const status = response.status;

        if (status == 200 || status == 204) {
            const resultData200 = response instanceof HttpResponse ? response.body : undefined;

            if (resultData200) {
                return Observable.of(this.fromJsConversion(resultData200));
            }
        }
        else {
            throw new Error("Object not updated");
        }
        return Observable.of<T | null>(<any>null);
    }

    deleteById(id: number): Observable<any | null> {
        return this.delete("/{id}", {
            "id": id
        });
    }

    delete(additionToBaseURL?: string, parametersToReplace?: {}): Observable<any | null> {
        let url_ = this.prepareApiUrl(additionToBaseURL, parametersToReplace);

        let options_: any = {
            observe: "response",
            headers: this.headers
        };

        return this.http.request("delete", url_, options_).flatMap((response_: any) => {
            return this.processDelete(response_);
        }).catch((response_: any) => {
            return <any>Observable.throw(response_);
        });
    }

    protected processDelete(response: HttpResponseBase): Observable<any | null> {
        const status = response.status;

        return Observable.of<any | null>(status);
    }

    /**
     * Replaces variables in URL with real data
     *      
     * @protected
     * @param {string} additionToBaseURL 
     * @param {{}} parametersToReplace 
     * @returns {string} 
     * @memberof BaseApiHandler
     */
    protected prepareApiUrl(additionToBaseURL: string, parametersToReplace: {}): string {
        //TODO: zabezpieczyc przed sytuacja zapomnienia o \
        let url_ = this.baseUrl;
        if (additionToBaseURL) {
            url_ += additionToBaseURL;
        }
        url_ = url_.replace(/[?&]$/, "");
        for (let key in parametersToReplace) {
            let paramInURL = "{" + key + "}";
            var re = new RegExp("\{" + key + "\}", "g");
            url_ = url_.replace(re, parametersToReplace[key]);
        }

        return url_;
    }
}