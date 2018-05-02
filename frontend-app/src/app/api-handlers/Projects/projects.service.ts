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
import { SwaggerException, FileResponse, throwException, blobToText } from '../tools'
import { ProjectDTO } from '../../DTOs/ProjectDTO';
import { AuthService } from '../../services/auth.service';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

@Injectable()
export class ProjectsService {
  private http: HttpClient;
  private baseUrl: string;
  private headers: HttpHeaders;
  protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

  constructor(private authService: AuthService, @Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
    this.http = http;
    this.baseUrl = baseUrl ? baseUrl : "http://localhost:5003";
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": this.authService.getAuthorizationHeaderValue()
    });
  }

  getProjects(): Observable<ProjectDTO[] | null> {
    let url_ = this.baseUrl + "/api/Projects";
    url_ = url_.replace(/[?&]$/, "");

    let options_: any = {
      observe: "response",
      responseType: "blob",
      headers: this.headers
    };

    return this.http.request("get", url_, options_).flatMap((response_: any) => {
      return this.processGetProjects(response_);
    }).catch((response_: any) => {
      if (response_ instanceof HttpResponseBase) {
        try {
          return this.processGetProjects(<any>response_);
        } catch (e) {
          return <Observable<ProjectDTO[] | null>><any>Observable.throw(e);
        }
      } else
        return <Observable<ProjectDTO[] | null>><any>Observable.throw(response_);
    });
  }

  protected processGetProjects(response: HttpResponseBase): Observable<ProjectDTO[] | null> {
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
            result200.push(ProjectDTO.fromJS(item));
        }
        return Observable.of(result200);
      });
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).flatMap(_responseText => {
        return throwException("An unexpected server error occurred.", status, _responseText, _headers);
      });
    }
    return Observable.of<ProjectDTO[] | null>(<any>null);
  }

  postProject(dto: ProjectDTO | null): Observable<FileResponse | null> {
    let url_ = this.baseUrl + "/api/Projects";
    url_ = url_.replace(/[?&]$/, "");

    const content_ = JSON.stringify(dto);

    let options_: any = {
      body: content_,
      observe: "response",
      responseType: "blob",
      headers: this.headers
    };

    return this.http.request("post", url_, options_).flatMap((response_: any) => {
      return this.processPostProject(response_);
    }).catch((response_: any) => {
      if (response_ instanceof HttpResponseBase) {
        try {
          return this.processPostProject(<any>response_);
        } catch (e) {
          return <Observable<FileResponse | null>><any>Observable.throw(e);
        }
      } else
        return <Observable<FileResponse | null>><any>Observable.throw(response_);
    });
  }

  protected processPostProject(response: HttpResponseBase): Observable<FileResponse | null> {
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

  getProject(id: number): Observable<FileResponse | null> {
    let url_ = this.baseUrl + "/api/Projects/{id}";
    if (id === undefined || id === null)
      throw new Error("The parameter 'id' must be defined.");
    url_ = url_.replace("{id}", encodeURIComponent("" + id));
    url_ = url_.replace(/[?&]$/, "");

    let options_: any = {
      observe: "response",
      responseType: "blob",
      headers: this.headers
    };

    return this.http.request("get", url_, options_).flatMap((response_: any) => {
      return this.processGetProject(response_);
    }).catch((response_: any) => {
      if (response_ instanceof HttpResponseBase) {
        try {
          return this.processGetProject(<any>response_);
        } catch (e) {
          return <Observable<FileResponse | null>><any>Observable.throw(e);
        }
      } else
        return <Observable<FileResponse | null>><any>Observable.throw(response_);
    });
  }

  protected processGetProject(response: HttpResponseBase): Observable<FileResponse | null> {
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

  putProject(id: number, dto: ProjectDTO | null): Observable<FileResponse | null> {
    let url_ = this.baseUrl + "/api/Projects/{id}";
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
      return this.processPutProject(response_);
    }).catch((response_: any) => {
      if (response_ instanceof HttpResponseBase) {
        try {
          return this.processPutProject(<any>response_);
        } catch (e) {
          return <Observable<FileResponse | null>><any>Observable.throw(e);
        }
      } else
        return <Observable<FileResponse | null>><any>Observable.throw(response_);
    });
  }

  protected processPutProject(response: HttpResponseBase): Observable<FileResponse | null> {
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

  deleteProject(id: number): Observable<FileResponse | null> {
    let url_ = this.baseUrl + "/api/Projects/{id}";
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
      return this.processDeleteProject(response_);
    }).catch((response_: any) => {
      if (response_ instanceof HttpResponseBase) {
        try {
          return this.processDeleteProject(<any>response_);
        } catch (e) {
          return <Observable<FileResponse | null>><any>Observable.throw(e);
        }
      } else
        return <Observable<FileResponse | null>><any>Observable.throw(response_);
    });
  }

  protected processDeleteProject(response: HttpResponseBase): Observable<FileResponse | null> {
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
