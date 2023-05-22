import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { GlobalConstants } from 'src/app/common/global-constants';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-add-edit-resource-master',
  templateUrl: './add-edit-resource-master.component.html',
  styleUrls: ['./add-edit-resource-master.component.scss']
})
export class AddEditResourceMasterComponent implements OnInit {
  readonly RESOURCE_CONSTANT = GlobalConstants;
  base_url = 'resources';
  id!: number;
  isAddMode!: boolean;
  addEditResourceForm: FormGroup = new FormGroup({
    resource_name: new FormControl(''),
    resource_url: new FormControl(''),
  });
  submitted = false;
  formData: any = {
    resource_name: '',
    resource_url: ''
  }
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private commonService: CommonService,
    private router: Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;
    this.addEditResourceForm = this.formBuilder.group(
      {
        resource_name: ['', Validators.required],
        resource_url: [''],
      });
    if (!this.isAddMode) {
      this.commonService.getById(`${this.base_url}`, this.id)
        .pipe(first())
        .subscribe(x => {
          this.addEditResourceForm.patchValue(x);
        });
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.addEditResourceForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.addEditResourceForm.invalid) {
      return;
    }
    if (this.isAddMode) {
      this.createResource();
    } else {
      this.updateResource();
    }
  }

  //Create Resource
  createResource() {
    try {
      this.formData.resource_name = this.addEditResourceForm.value.resource_name;
      this.formData.resource_url = this.addEditResourceForm.value.resource_url;

      this.commonService.CreateWithAuth(`${this.base_url}`, this.formData).pipe(first()).subscribe({
        next: (response: any) => {
          this.toastr.success(response.message);
          this.router.navigate(["/main/resource-master"]);
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

  //Update Resource
  updateResource() {
    try {
      this.formData.resource_name = this.addEditResourceForm.value.resource_name;
      this.formData.resource_url =  this.addEditResourceForm.value.resource_url;
      this.commonService.update(`${this.base_url}`, this.id, this.formData).pipe(first()).subscribe({
        next: (response: any) => {
          this.toastr.success(response.message);
          this.router.navigate(["/main/resource-master"]);
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
    this.addEditResourceForm.reset();
  }
}
