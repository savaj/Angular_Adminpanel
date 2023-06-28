import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApproveRejectBgComponent } from './approve-reject-bg.component';

const routes: Routes = [
  {
    path: '',
    component: ApproveRejectBgComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApproveRejectBgRoutingModule { }
