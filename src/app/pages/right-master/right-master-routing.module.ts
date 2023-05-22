import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RightMasterComponent } from './right-master.component';

const routes: Routes = [
  {
    path: '',
    component: RightMasterComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RightMasterRoutingModule { }
