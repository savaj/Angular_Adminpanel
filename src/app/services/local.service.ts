import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  constructor() { }

  //Save Localstorage
  public saveData(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  //Get Localstorage
  public getData(key: string) {
    return localStorage.getItem(key) || "";
  }

  //Remove LocalStorate specific value
  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  //Clear LocalStorage
  public clearData() {
    localStorage.clear();
  }
  
}