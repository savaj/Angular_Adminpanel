import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResourceMasterComponent } from './resource-master.component';
import { AddEditResourceMasterComponent } from './add-edit-resource-master/add-edit-resource-master.component';

const routes: Routes = [
  {
    path: '',
    component: ResourceMasterComponent
  },
  {
    path: 'add-edit-resource',
    component: AddEditResourceMasterComponent
  },
  {
    path: 'add-edit-resource/:id',
    component: AddEditResourceMasterComponent
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResourceMasterRoutingModule { }
