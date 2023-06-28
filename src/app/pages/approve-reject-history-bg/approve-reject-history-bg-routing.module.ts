import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApproveRejectHistoryBgComponent } from './approve-reject-history-bg.component';

const routes: Routes = [
  {
    path: '',
    component: ApproveRejectHistoryBgComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApproveRejectHistoryBgRoutingModule { }
