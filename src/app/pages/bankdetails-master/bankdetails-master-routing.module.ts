import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankdetailsMasterComponent } from './bankdetails-master.component';
import { AddBankdetailsMasterComponent } from './add-bankdetails-master/add-bankdetails-master.component';

const routes: Routes = [
  {
    path: '',
    component: BankdetailsMasterComponent
  },
  {
    path: "add-edit-bank-guarantee-master",
    component: AddBankdetailsMasterComponent
  },
  {
    path: 'add-edit-bank-guarantee-master/:id',
    component: AddBankdetailsMasterComponent
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankdetailsMasterRoutingModule { }
