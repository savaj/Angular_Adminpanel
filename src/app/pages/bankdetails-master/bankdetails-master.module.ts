import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { BankdetailsMasterRoutingModule } from './bankdetails-master-routing.module';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { BankdetailsMasterComponent } from './bankdetails-master.component';
import { AddBankdetailsMasterComponent } from './add-bankdetails-master/add-bankdetails-master.component';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    BankdetailsMasterComponent,
    AddBankdetailsMasterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    BankdetailsMasterRoutingModule,
    NgxSpinnerModule
  ],
  exports: [
    SharedModule
  ],
  providers: [DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BankdetailsMasterModule { }
