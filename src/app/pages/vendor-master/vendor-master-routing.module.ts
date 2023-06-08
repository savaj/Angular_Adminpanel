import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorMasterComponent } from './vendor-master.component';
import { AddEditVendorMasterComponent } from './add-edit-vendor-master/add-edit-vendor-master.component';

const routes: Routes = [
  {
    path: '',
    component: VendorMasterComponent
  },
  {
    path: 'add-edit-vendor',
    component: AddEditVendorMasterComponent
  },
  {
    path: 'add-edit-vendor/:id',
    component: AddEditVendorMasterComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorMasterRoutingModule { }
