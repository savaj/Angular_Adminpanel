import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorMasterRoutingModule } from './vendor-master-routing.module';
import { VendorMasterComponent } from './vendor-master.component';
import { AddEditVendorMasterComponent } from './add-edit-vendor-master/add-edit-vendor-master.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';


@NgModule({
  declarations: [
    VendorMasterComponent,
    AddEditVendorMasterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    VendorMasterRoutingModule
  ],
  exports: [
    SharedModule
  ]
})
export class VendorMasterModule { }
