import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenderMasterComponent } from './tender-master.component';
import { AddEditTenderMasterComponent } from './add-edit-tender-master/add-edit-tender-master.component';

const routes: Routes = [
  {
    path: '',
    component: TenderMasterComponent
  },
  {
    path: 'add-edit-tender',
    component: AddEditTenderMasterComponent
  },
  {
    path: 'add-edit-tender/:id',
    component: AddEditTenderMasterComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TenderMasterRoutingModule { }
