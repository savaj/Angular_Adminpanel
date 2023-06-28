import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BgReturnComponent } from './bg-return.component';
import { AddEditBgReturnComponent } from './add-edit-bg-return/add-edit-bg-return.component';

const routes: Routes = [
  {
    path: '',
    component: BgReturnComponent
  },
  {
    path: "add-edit-bg-return",
    component: AddEditBgReturnComponent
  },
  {
    path: 'add-edit-bg-return/:id',
    component: AddEditBgReturnComponent
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BgReturnRoutingModule { }
