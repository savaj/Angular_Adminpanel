import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertService } from './alert.service';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AutocompleteLibModule
  ],
  exports: [
    ReactiveFormsModule,
    AutocompleteLibModule
  ],
  providers: [
    AlertService
  ],
})
export class SharedModule { }
