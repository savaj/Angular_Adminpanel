import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleMasterComponent } from './role-master.component';
import { AddEditRoleMasterComponent } from './add-edit-role-master/add-edit-role-master.component';

const routes: Routes = [
  {
    path: '',
    component: RoleMasterComponent
  },
  {
    path: 'add-edit-role',
    component: AddEditRoleMasterComponent
  },
  {
    path: 'add-edit-role/:id',
    component: AddEditRoleMasterComponent
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleMasterRoutingModule { }
