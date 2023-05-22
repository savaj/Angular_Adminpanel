import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './modules/main/main.component';
import { AuthGuard } from './guards/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './modules/login/login.component';
import { NonAuthGuard } from './guards/non-auth.guard';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NonAuthGuard]
  },
  {
    path: 'main',
    component: MainComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
        {
            path: 'profile',
            component: ProfileComponent
        },
        {
          path: 'flow-master',
          loadChildren: () => import('./pages/flow-master/flow-master.module').then(m => m.FlowMasterModule)
        },
        {
          path: 'role-master',
          loadChildren: () => import('./pages/role-master/role-master.module').then(m => m.RoleMasterModule)
        },
        {
          path: 'resource-master',
          loadChildren: () => import('./pages/resource-master/resource-master.module').then(m => m.ResourceMasterModule)
        },
        {
          path: 'right-master',
          loadChildren: () => import('./pages/right-master/right-master.module').then(m => m.RightMasterModule)
        },
        {
          path: 'users',
          loadChildren: () => import('./pages/users/users.module').then(m => m.UsersModule)
        },
        {
          path: 'admin-menu-master',
          loadChildren: () => import('./pages/admin-menu-master/admin-menu-master.module').then(m => m.AdminMenuMasterModule)
        },
        {
            path: 'dashboard',
            component: DashboardComponent
        }
    ]
  },
  // {
  //   path: 'login',
  //   component: LoginComponent,
  //   canActivate: [NonAuthGuard]
  // },
  //{path: '**', redirectTo: '/login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
