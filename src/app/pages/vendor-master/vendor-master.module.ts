import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorMasterRoutingModule } from './vendor-master-routing.module';
import { VendorMasterComponent } from './vendor-master.component';
import { AddEditVendorMasterComponent } from './add-edit-vendor-master/add-edit-vendor-master.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    VendorMasterComponent,
    AddEditVendorMasterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    VendorMasterRoutingModule,
    NgxSpinnerModule
  ],
  exports: [
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VendorMasterModule { }
