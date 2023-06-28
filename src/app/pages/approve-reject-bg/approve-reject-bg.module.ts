import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApproveRejectBgRoutingModule } from './approve-reject-bg-routing.module';
import { ApproveRejectBgComponent } from './approve-reject-bg.component';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    ApproveRejectBgComponent
  ],
  imports: [
    CommonModule,
    ApproveRejectBgRoutingModule,
    NgxSpinnerModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ApproveRejectBgModule { }
