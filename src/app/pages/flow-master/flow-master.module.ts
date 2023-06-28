import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlowMasterRoutingModule } from './flow-master-routing.module';
import { AddFlowMasterComponent } from './add-flow-master/add-flow-master.component';
import { FlowMasterComponent } from './flow-master.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    FlowMasterComponent,
    AddFlowMasterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FlowMasterRoutingModule,
    NgxSpinnerModule
  ],
  exports: [
    SharedModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FlowMasterModule { }
