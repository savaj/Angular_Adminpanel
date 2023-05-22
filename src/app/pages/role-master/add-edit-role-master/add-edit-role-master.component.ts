import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { GlobalConstants } from 'src/app/common/global-constants';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-add-edit-role-master',
  templateUrl: './add-edit-role-master.component.html',
  styleUrls: ['./add-edit-role-master.component.scss']
})
export class AddEditRoleMasterComponent implements OnInit {
  readonly ROLE_CONSTANT = GlobalConstants;
  base_url = 'roles';
  id!: number;
  isAddMode!: boolean;
  addEditRoleForm: FormGroup = new FormGroup({
     role_name: new FormControl(''),
  });
  submitted = false;
  formData: any = {
    role_name: ''
  }
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private commonService: CommonService,
    private router: Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;
    this.addEditRoleForm = this.formBuilder.group(
      {
        role_name: ['', Validators.required],
      });
      if (!this.isAddMode) {
        this.commonService.getById(`${this.base_url}`, this.id)
        .pipe(first())
        .subscribe(x => {
          this.formData.role_name = x.role_name;
          this.addEditRoleForm.patchValue(this.formData)
        });
      }
  }
  
  get f(): { [key: string]: AbstractControl } {
    return this.addEditRoleForm.controls;
  }

  onSubmit(): void {
    
    this.submitted = true;
    if (this.addEditRoleForm.invalid) {
      return;
    }
    if (this.isAddMode) {
      this.createRole();
  } else {
      this.updateRole();
  }
}

//Create Role
private createRole() {
  try {
      this.commonService.CreateWithAuth(`${this.base_url}`, this.addEditRoleForm.value).pipe(first()).subscribe({
        next: (response: any) => {
          this.toastr.success(response.message);
          this.router.navigate(["/main/role-master"]);
        },
        error: (err: any) => {
          this.toastr.error(err.error.message);
        },
        complete: () => console.log('completed')
      });
    } catch (error: any) {
      this.toastr.error(error.message);
    }
}

//Update Role
private updateRole() {
try {
      this.formData.role_name = this.addEditRoleForm.value.role_name;
  this.commonService.update(`${this.base_url}`,this.id, this.formData).pipe(first()).subscribe({
    next: (response: any) => {
      this.toastr.success(response.message);
      this.router.navigate(["/main/role-master"]);
    },
    error: (err: any) => {
      this.toastr.error(err.error.message);
    },
    complete: () => console.log('completed')
  });
} catch (error: any) {
  this.toastr.error(error.message);
}
}
  
  onReset(): void {
    this.submitted = false;
    this.addEditRoleForm.reset();
  }
}
