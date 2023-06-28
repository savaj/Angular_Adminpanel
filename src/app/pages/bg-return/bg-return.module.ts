import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BgReturnRoutingModule } from './bg-return-routing.module';
import { BgReturnComponent } from './bg-return.component';
import { AddEditBgReturnComponent } from './add-edit-bg-return/add-edit-bg-return.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    BgReturnComponent,
    AddEditBgReturnComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    BgReturnRoutingModule,
    NgxSpinnerModule
  ],
  exports: [
    SharedModule
  ]
})
export class BgReturnModule { }
