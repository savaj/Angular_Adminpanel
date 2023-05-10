import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { throwError, catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseurl = `${environment.apiURL}/api/`
  constructor(private http: HttpClient) { }

  //Create 
  create(resource: string, data: any) {
      return this.http.post(`${this.baseurl}${resource}`, data).pipe(
        catchError(this.handleError)
    );
  }

  //GetAll
  getAll(resource: string): Observable<any> {
      return this.http.get(`${this.baseurl}${resource}`).pipe(
        catchError(this.handleError)
    );
  }

  //GetById
  getById(resource: string, id: number): Observable<any> {
    return this.http.get(`${this.baseurl}${resource}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  //Update
  update(resource: string, id: number, data: any): Observable<any>{
    return this.http.put(`${this.baseurl}${resource}/${id}`, data).pipe(
      catchError(this.handleError)
    );
  }

  //Delete
  delete(resource: string, id: number, data: any): Observable<any> {
    return this.http.delete(`${this.baseurl}${resource}/${id}`, data).pipe(
      catchError(this.handleError)
    );
  }

  //HandleError
  handleError(error: any) {
    console.error(error);
    return throwError(() => error);
  }
  
}
