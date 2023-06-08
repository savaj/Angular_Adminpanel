import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { BankdetailsMasterRoutingModule } from './bankdetails-master-routing.module';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { BankdetailsMasterComponent } from './bankdetails-master.component';
import { AddBankdetailsMasterComponent } from './add-bankdetails-master/add-bankdetails-master.component';


@NgModule({
  declarations: [
    BankdetailsMasterComponent,
    AddBankdetailsMasterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    BankdetailsMasterRoutingModule
  ],
  exports: [
    SharedModule
  ],
  providers: [DatePipe]
})
export class BankdetailsMasterModule { }
