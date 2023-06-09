import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleMasterRoutingModule } from './role-master-routing.module';
import { AddEditRoleMasterComponent } from './add-edit-role-master/add-edit-role-master.component';
import { RoleMasterComponent } from './role-master.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    RoleMasterComponent,
    AddEditRoleMasterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RoleMasterRoutingModule,
    NgxSpinnerModule
  ],
  exports: [
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RoleMasterModule { }
