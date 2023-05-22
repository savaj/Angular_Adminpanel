import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleMasterRoutingModule } from './role-master-routing.module';
import { AddEditRoleMasterComponent } from './add-edit-role-master/add-edit-role-master.component';
import { RoleMasterComponent } from './role-master.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';


@NgModule({
  declarations: [
    RoleMasterComponent,
    AddEditRoleMasterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RoleMasterRoutingModule
  ],
  exports: [
    SharedModule
  ]
})
export class RoleMasterModule { }
