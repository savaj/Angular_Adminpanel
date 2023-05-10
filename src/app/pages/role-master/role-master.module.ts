import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleMasterRoutingModule } from './role-master-routing.module';
import { AddRoleMasterComponent } from './add-role-master/add-role-master.component';
import { RoleMasterComponent } from './role-master.component';


@NgModule({
  declarations: [
    RoleMasterComponent,
    AddRoleMasterComponent
  ],
  imports: [
    CommonModule,
    RoleMasterRoutingModule
  ]
})
export class RoleMasterModule { }
