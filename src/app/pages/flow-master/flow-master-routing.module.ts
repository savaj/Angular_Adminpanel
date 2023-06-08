import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlowMasterComponent } from './flow-master.component';
import { AddFlowMasterComponent } from './add-flow-master/add-flow-master.component';


const routes: Routes = [
  {
    path: '',
    component: FlowMasterComponent
  },
  {
    path: 'add-flow-master',
    component: AddFlowMasterComponent
  },
  {
    path: 'add-flow-master/:id',
    component: AddFlowMasterComponent
  }    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlowMasterRoutingModule { }
