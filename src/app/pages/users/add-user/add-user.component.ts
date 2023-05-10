import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  form: FormGroup = new FormGroup({
    fname: new FormControl(''),
    lname: new FormControl(''),
    email: new FormControl(''),
    mobilenumber: new FormControl(''),
    password: new FormControl(''),
    designation: new FormControl(''),
    department: new FormControl(''),
    hod: new FormControl(''),
    branch: new FormControl(''),
  });
  submitted = false;

  constructor(private formBuilder: FormBuilder,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        fname: ['', Validators.required],
        lname: ['', Validators.required],
        email: ['', [Validators.required]],
        mobilenumber: ['', [Validators.required]],
        password: ['', Validators.required],
        designation: ['', Validators.required],
        department: ['', Validators.required],
        hod: ['', Validators.required],
        branch: ['', Validators.required]
      },
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    try{
      this.submitted = true;
      if (this.form.invalid) {
        return;
      }
      console.log(JSON.stringify(this.form.value, null, 2));
      //this.userService.postUser('/', JSON.stringify(this.form.value, null, 2));
      this.toastr.success('User Created Successfully');

    } catch(error: any){
      this.toastr.error(error.message);
    }
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }

}
