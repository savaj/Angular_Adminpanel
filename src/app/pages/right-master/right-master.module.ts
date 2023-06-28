import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RightMasterRoutingModule } from './right-master-routing.module';
import { RightMasterComponent } from './right-master.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    RightMasterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RightMasterRoutingModule,
    NgxSpinnerModule
  ],
  exports: [
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RightMasterModule { }
