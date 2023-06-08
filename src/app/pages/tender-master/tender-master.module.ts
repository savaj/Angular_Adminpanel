import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TenderMasterRoutingModule } from './tender-master-routing.module';
import { TenderMasterComponent } from './tender-master.component';
import { AddEditTenderMasterComponent } from './add-edit-tender-master/add-edit-tender-master.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';


@NgModule({
  declarations: [
    TenderMasterComponent,
    AddEditTenderMasterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TenderMasterRoutingModule
  ],
  exports: [
    SharedModule
  ]
})
export class TenderMasterModule { }
