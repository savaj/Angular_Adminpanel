import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminMenuMasterRoutingModule } from './admin-menu-master-routing.module';
import { AddEditAdminMenuMasterComponent } from './add-edit-admin-menu-master/add-edit-admin-menu-master.component';
import { AdminMenuMasterComponent } from './admin-menu-master.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';


@NgModule({
  declarations: [
    AdminMenuMasterComponent,
    AddEditAdminMenuMasterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminMenuMasterRoutingModule
  ]
})
export class AdminMenuMasterModule { }
