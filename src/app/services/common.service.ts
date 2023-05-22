import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { throwError, catchError, Observable } from 'rxjs';
import { LocalService } from 'src/app/services/local.service';
import{ GlobalConstants } from '../common/global-constants';



var headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
});

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private baseurl = `${environment.apiURL}${GlobalConstants.apiURL}`;

  constructor(private http: HttpClient, private localStore: LocalService) {
  }  

  commonHeaders(){
    const authToken = this.localStore.getData(GlobalConstants.token);
    headers = new HttpHeaders().set(GlobalConstants.authText, `${GlobalConstants.bearerText}${authToken}`);
    return headers;
  }
  //Create 
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

  //GetById
  getByData(resource: string, body: any): Observable<any> {
    var url = `${this.baseurl}${resource}`;
    console.log(body);
    if(body.roleId && body.roleId !== 0){
      url += `/${body.roleId}`;
    }
    if(body.menuId && body.menuId !== 0){
      url += `/${body.menuId}`;
    }
    console.log(url);
    return this.http.get(url, { headers: this.commonHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  //Update
  update(resource: string, id: number, data: any): Observable<any>{
    return this.http.put(`${this.baseurl}${resource}/${id}`, data, { headers: this.commonHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  bulkupdate(resource: string, data: any): Observable<any>{
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

  //HandleError
  handleError(error: any) {
    console.error(error);
    return throwError(() => error);
  }

  findByTitle(title: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseurl}?title=${title}`);
  }
  
}
