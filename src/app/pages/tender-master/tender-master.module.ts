import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { TenderMasterRoutingModule } from './tender-master-routing.module';
import { TenderMasterComponent } from './tender-master.component';
import { AddEditTenderMasterComponent } from './add-edit-tender-master/add-edit-tender-master.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    TenderMasterComponent,
    AddEditTenderMasterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TenderMasterRoutingModule,
    NgxSpinnerModule,
  ],
  exports: [
    SharedModule
  ],
  providers: [DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class TenderMasterModule { }
