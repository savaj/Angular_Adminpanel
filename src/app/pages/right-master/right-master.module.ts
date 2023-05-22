import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RightMasterRoutingModule } from './right-master-routing.module';
import { RightMasterComponent } from './right-master.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';


@NgModule({
  declarations: [
    RightMasterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RightMasterRoutingModule
  ],
  exports: [
    SharedModule
  ]
})
export class RightMasterModule { }
