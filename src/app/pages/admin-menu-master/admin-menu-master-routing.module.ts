import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminMenuMasterComponent } from './admin-menu-master.component';
import { AddEditAdminMenuMasterComponent } from './add-edit-admin-menu-master/add-edit-admin-menu-master.component';

const routes: Routes = [
  {
    path: '',
    component: AdminMenuMasterComponent
  },
  {
    path: 'add-edit-menu-master',
    component: AddEditAdminMenuMasterComponent
  },
  {
    path: 'add-edit-menu-master/:id',
    component: AddEditAdminMenuMasterComponent
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminMenuMasterRoutingModule { }
