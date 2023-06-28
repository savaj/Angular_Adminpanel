import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminMenuMasterRoutingModule } from './admin-menu-master-routing.module';
import { AddEditAdminMenuMasterComponent } from './add-edit-admin-menu-master/add-edit-admin-menu-master.component';
import { AdminMenuMasterComponent } from './admin-menu-master.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { MenuItemComponent } from 'src/app/components/menu-item/menu-item.component';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    AdminMenuMasterComponent,
    AddEditAdminMenuMasterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminMenuMasterRoutingModule,
    NgxSpinnerModule,
  ],
  providers: [
    MenuItemComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class AdminMenuMasterModule { }
