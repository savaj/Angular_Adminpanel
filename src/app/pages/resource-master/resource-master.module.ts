import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResourceMasterRoutingModule } from './resource-master-routing.module';
import { ResourceMasterComponent } from './resource-master.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { AddEditResourceMasterComponent } from './add-edit-resource-master/add-edit-resource-master.component';


@NgModule({
  declarations: [
    ResourceMasterComponent,
    AddEditResourceMasterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ResourceMasterRoutingModule
  ],
  exports: [
    SharedModule
  ]
})
export class ResourceMasterModule { }
