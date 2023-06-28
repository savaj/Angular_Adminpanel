import { variable } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { GlobalConstants } from '../../../common/global-constants';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  readonly MY_CONSTANT = GlobalConstants;

  base_url = 'users';
  role_url: string = 'roles';
  roleData?: any[];
  id!: number;
  isAddMode!: boolean;
  branch = [
    {
      name: 'E-gov'
    },
    {
      name: 'H&N'
    },
    {
      name: 'Account'
    },
    {
      name: 'HR/Admin'
    }
  ]

  //User Form Group
  addEditUserForm: FormGroup = new FormGroup({
    firstname: new FormControl(''),
    middlename: new FormControl(''),
    email: new FormControl(''),
    mobile_number: new FormControl(''),
    designation: new FormControl(''),
    department: new FormControl(''),
    hod: new FormControl(''),
    branch: new FormControl(''),
  });
  submitted = false;

  //User submitted Data Object
  formData: any = {
    firstname: '',
    middlename: '',
    email: '',
    mobile_number: '',
    designation: '',
    department: '',
    hod: '',
    branch: ''
  }

  //Dependency Injection
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private userService: CommonService,
    private router: Router) { }

  //User Initialization
  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.addEditUserForm = this.formBuilder.group(
      {
        firstname: ['', Validators.required],
        middlename: ['', Validators.required],
        email: ['', { validators: [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-z]{2,4}$")], updateOn: "blur" }],
        mobile_number: ['', { validators: [Validators.required, Validators.pattern("^[0-9]{10}$")], updateOn: "blur" }],
        designation: ['', Validators.required],
        department: ['', Validators.required],
        hod: ['', Validators.required],
        branch: ['', Validators.required]
      },
    );
    this.roles()
    if (!this.isAddMode) {
      this.userService.getById(`${this.base_url}`, this.id)
        .pipe(first())
        .subscribe(x => {
          this.formData.firstname = x.firstname;
          this.formData.middlename = x.middlename;
          this.formData.email = x.email;
          this.formData.mobile_number = x.mobile_number;
          this.formData.designation = x.role_id;
          this.formData.department = x.department;
          this.formData.hod = x.hod;
          this.formData.branch = x.branch;
          this.addEditUserForm.patchValue(this.formData)

        });
    }
  }

  //Get User FormControl
  get f(): { [key: string]: AbstractControl } {
    return this.addEditUserForm.controls;
  }

  //User Added/Updated Data Action
  onSubmit(): void {
    this.submitted = true;
    if (this.addEditUserForm.invalid) {
      return;
    }
    if (this.isAddMode) {
      this.createUser();
    } else {
      this.updateUser();
    }
  }

  //Create User
  private createUser() {
    try {
      this.userService.CreateWithAuth(`${this.base_url}`, this.addEditUserForm.value).pipe(first()).subscribe({
        next: (response: any) => {
          this.toastr.success(response.message);
          this.router.navigate(["/main/users"]);
        },
        error: (err: any) => {
          this.toastr.error(err.error.message);
        }
      });
    } catch (error: any) {
      this.toastr.error(error.message);
    }
  }

  //Update User
  private updateUser() {
    try {
      this.formData.firstname = this.addEditUserForm.value.firstname;
      this.formData.middlename = this.addEditUserForm.value.middlename;
      this.formData.email = this.addEditUserForm.value.email;
      this.formData.mobile_number = this.addEditUserForm.value.mobile_number;
      this.formData.role_id = this.addEditUserForm.value.designation;
      this.formData.department = this.addEditUserForm.value.department;
      this.formData.hod = this.addEditUserForm.value.hod;
      this.formData.branch = this.addEditUserForm.value.branch;
      this.userService.update(`${this.base_url}`, this.id, this.formData).pipe(first()).subscribe({
        next: (response: any) => {
          this.toastr.success(response.message);
          this.router.navigate(["/main/users"]);
        },
        error: (err: any) => {
          this.toastr.error(err.error.message);
        }
      });
    } catch (error: any) {
      this.toastr.error(error.message);
    }
  }

  //Get Roles For the Add User
  roles(): void {
    this.userService.getAll(this.role_url)
      .subscribe({
        next: (response: any) => {
          this.roleData = response.data;
        },
        error: (err: any) => {
          this.toastr.error(err.error.message);
        }
      });
  }

  //Form Reset for add user
  onReset(): void {
    this.submitted = false;
    this.addEditUserForm.reset();
  }

}
