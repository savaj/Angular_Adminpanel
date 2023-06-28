import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuItemComponent } from './components/menu-item/menu-item.component';
import { LoginComponent } from './modules/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { MainComponent } from './modules/main/main.component';
import { HeaderComponent } from './modules/main/header/header.component';
import { MenuSidebarComponent } from './modules/main/menu-sidebar/menu-sidebar.component';
import { ControlSidebarComponent } from './modules/main/control-sidebar/control-sidebar.component';
import { DataTablesModule } from "angular-datatables";
import { UsersModule } from './pages/users/users.module';
import { FlowMasterModule } from './pages/flow-master/flow-master.module';
import { RoleMasterModule } from './pages/role-master/role-master.module';
import { ResourceMasterModule } from './pages/resource-master/resource-master.module';
import { RightMasterModule } from './pages/right-master/right-master.module';
import { BankdetailsMasterModule } from './pages/bankdetails-master/bankdetails-master.module';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { JwtModule } from '@auth0/angular-jwt';
import { NgxSpinnerModule } from "ngx-spinner";
import { BgReturnModule } from './pages/bg-return/bg-return.module';


@NgModule({
  declarations: [
    AppComponent,
    MenuItemComponent,
    LoginComponent,
    DashboardComponent,
    ProfileComponent,
    MainComponent,
    HeaderComponent,
    MenuSidebarComponent,
    ControlSidebarComponent
  ],
  imports: [
    BrowserModule,
    AutocompleteLibModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true
    }), 
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('token'),
        allowedDomains: ['http://localhost:4200/, http://10.10.2.150:5984', '*'], // Replace with your domain
        disallowedRoutes: [''] // Replace with your login route
      }
    }),
    BrowserAnimationsModule,
    NgxSpinnerModule,
    UsersModule,
    FlowMasterModule,
    RoleMasterModule,
    ResourceMasterModule,
    RightMasterModule,
    BgReturnModule,
    BankdetailsMasterModule,
    DataTablesModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
