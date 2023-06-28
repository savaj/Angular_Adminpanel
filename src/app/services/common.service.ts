import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { throwError, catchError, Observable } from 'rxjs';
import { LocalService } from './local.service';
import { GlobalConstants } from '../common/global-constants';
import { JwtHelperService } from '@auth0/angular-jwt';

//Headers For all methods
var headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
});

//File upload Headers
var headersFileUpload = new HttpHeaders({
  'Content-Type': 'multipart/form-data',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'allowedHeaders': 'Origin,X-Requested-With,Content-Type,Accept, Authorization'
});


@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private baseurl = `${environment.apiURL}${GlobalConstants.apiURL}`;

  //Dependency Injector
  constructor(private http: HttpClient, private localStore: LocalService,
    private jwtHelper: JwtHelperService) {
  }

  //Common Header For the all http methods
  commonHeaders() {
    const authToken = this.localStore.getData(GlobalConstants.token);
    headers = new HttpHeaders().set(GlobalConstants.authText, `${GlobalConstants.bearerText}${authToken}`);
    return headers;
  }

  //Common Header For File Upload
  commonHeadersFileUpload() {
    const authToken = this.localStore.getData(GlobalConstants.token);
    headersFileUpload = new HttpHeaders().set(GlobalConstants.authText, `${GlobalConstants.bearerText}${authToken}`);
    return headersFileUpload;
  }

  //Create Without Auth
  createWithoutAuth(resource: string, data: any) {
    return this.http.post(`${this.baseurl}${resource}`, data).pipe(
      catchError(this.handleError)
    );
  }

  //CreateWithAuth
  CreateWithAuth(resource: string, data: any) {
    return this.http.post(`${this.baseurl}${resource}`, data, { headers: this.commonHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  //Create With Auth Upload
  CreateWithAuthUpload(resource: string, data: any) {
    return this.http.post(`${this.baseurl}${resource}`, data, { headers: this.commonHeadersFileUpload() }).pipe(
      catchError(this.handleError)
    );
  }

  //GetAll
  getAll(resource: string): Observable<any> {
    return this.http.get(`${this.baseurl}${resource}`, { headers: this.commonHeaders() }).pipe(
      catchError(this.handleError)
    );
  }


  //GetById
  getById(resource: string, id: number): Observable<any> {
    return this.http.get(`${this.baseurl}${resource}/${id}`, { headers: this.commonHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  //Get By IFSC
  getByIFSC(resource: string, ifsc: string): Observable<any> {
    return this.http.get(`${this.baseurl}${resource}/${ifsc}`, { headers: this.commonHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  //GetById
  getByData(resource: string, body: any): Observable<any> {
    var url = `${this.baseurl}${resource}`;
    if (body.roleId && body.roleId !== 0) {
      url += `/${body.roleId}`;
    }
    if (body.menuId && body.menuId !== 0) {
      url += `/${body.menuId}`;
    }
    return this.http.get(url, { headers: this.commonHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  //Update Data with Id
  update(resource: string, id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseurl}${resource}/${id}`, data, { headers: this.commonHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  //Update Data Without Id
  updateWithoutId(resource: string, data: any): Observable<any> {
    return this.http.put(`${this.baseurl}${resource}`, data, { headers: this.commonHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  //Bulk Update
  bulkupdate(resource: string, data: any): Observable<any> {
    return this.http.put(`${this.baseurl}${resource}`, data, { headers: this.commonHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  //Delete
  delete(resource: string, id: number, is_deleted: boolean): Observable<any> {
    return this.http.delete(`${this.baseurl}${resource}/${id}/${is_deleted}`, { headers: this.commonHeaders() }).pipe(
      catchError(this.handleError)
    );
  }


  //Find By FieldName
  findByFieldName(resource: string, fieldName: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseurl}${resource}?role_name=${fieldName}`, { headers: this.commonHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  //HandleError
  handleError(error: any) {
    return throwError(() => error);
  }

  //Extract Data from Token
  extractDataFromToken() {
    try {
      const authToken = this.localStore.getData(GlobalConstants.token);
      const decodedToken = this.jwtHelper.decodeToken(authToken);
      // Extract the desired data from the decoded token
      const email = decodedToken.email;
      const userId = decodedToken.id;
      const roleId = decodedToken.role_id;
      // Return the extracted data
      return { email, userId, roleId };
    } catch (error) {
      return null;
    }
  }

  //Open Document
  postDocument(resource: string, data: any): Observable<any[]> {
    return this.http.post<any>(`${this.baseurl}${resource}`, data, { headers: this.commonHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

}