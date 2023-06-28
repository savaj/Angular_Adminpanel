import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApproveRejectHistoryBgRoutingModule } from './approve-reject-history-bg-routing.module';
import { ApproveRejectHistoryBgComponent } from './approve-reject-history-bg.component';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    ApproveRejectHistoryBgComponent
  ],
  imports: [
    CommonModule,
    ApproveRejectHistoryBgRoutingModule,
    NgxSpinnerModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class ApproveRejectHistoryBgModule { }
