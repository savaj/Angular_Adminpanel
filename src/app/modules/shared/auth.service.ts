import { Injectable } from '@angular/core';
import { LocalService } from 'src/app/services/local.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private localStore: LocalService) { }

  IsloggedIn(){
    return !!this.localStore.getData('token');
  }
}
