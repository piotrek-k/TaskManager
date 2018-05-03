import { BaseApiHandler } from './../base-api-handler';
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
import { ColumnDTO } from '../../DTOs/ColumnDTO';
import { AuthService } from '../../services/auth.service';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

@Injectable()
export class ColumnsService extends BaseApiHandler {
    constructor(authService: AuthService, @Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        super(
          authService,
          http,
          baseUrl ? baseUrl : "http://localhost:5003/api/Columns",
          new HttpHeaders({
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": authService.getAuthorizationHeaderValue()
          }));
      }
    
      protected fromJsConversion(data: any) : any{
        return ColumnDTO.fromJS(data);
      }
}
