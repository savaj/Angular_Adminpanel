import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { SharedModule } from '../shared/shared.module';
import { UserService } from 'src/app/services/user1.service';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    SharedModule,
    LoginRoutingModule
  ],
  providers: [UserService],
})
export class LoginModule { }
