import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { GlobalConstants } from 'src/app/common/global-constants';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-add-edit-vendor-master',
  templateUrl: './add-edit-vendor-master.component.html',
  styleUrls: ['./add-edit-vendor-master.component.scss']
})
export class AddEditVendorMasterComponent implements OnInit {
  readonly VENDOR_CONSTANT = GlobalConstants;

  base_url = 'vendors';
  id!: number;
  isAddMode!: boolean;
  addEditVendorForm: FormGroup = new FormGroup({
    vendor_name: new FormControl(''),
    vendor_address: new FormControl(''),
    contact_person_name: new FormControl(''),
    contact_person_email: new FormControl(''),
    contact_person_mobile_no: new FormControl(''),
  });
  submitted = false;
  formData: any = {
    vendor_name: '',
    vendor_address: '',
    contact_person_name: '',
    contact_person_email: '',
    contact_person_mobile_no: ''
  }
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private commonService: CommonService,
    private router: Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.addEditVendorForm = this.formBuilder.group(
      {
        vendor_name: ['', Validators.required],
        vendor_address: ['', Validators.required],
        contact_person_name: ['', Validators.required],
        contact_person_email: ['', { validators: [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$")], updateOn: "blur" }],
        contact_person_mobile_no: ['',{ validators: [Validators.required, Validators.pattern("^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$")], updateOn: "blur" }],
      },
    );

    if (!this.isAddMode) {
      this.commonService.getById(`${this.base_url}`, this.id)
        .pipe(first())
        .subscribe(x => {
          this.formData.vendor_name = x.vendor_name;
          this.formData.vendor_address = x.vendor_address;
          this.formData.contact_person_name = x.contact_person_name;
          this.formData.contact_person_email = x.contact_person_email;
          this.formData.contact_person_mobile_no = x.contact_person_mobile_no;
          this.addEditVendorForm.patchValue(this.formData)
        });
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.addEditVendorForm.controls;
  }

  onSubmit(): void {

    this.submitted = true;
    if (this.addEditVendorForm.invalid) {
      return;
    }
    if (this.isAddMode) {
      this.createVendor();
    } else {
      this.updateVendor();
    }
  }

  //Create Vendor
  private createVendor() {
    try {
      this.commonService.CreateWithAuth(`${this.base_url}`, this.addEditVendorForm.value).pipe(first()).subscribe({
        next: (response: any) => {
          this.toastr.success(response.message);
          this.router.navigate(["/main/vendor-master"]);
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

  //Update Vendor
  private updateVendor() {
    try {
      this.formData.vendor_name = this.addEditVendorForm.value.vendor_name;
      this.formData.vendor_address = this.addEditVendorForm.value.vendor_address;
      this.formData.contact_person_name = this.addEditVendorForm.value.contact_person_name;
      this.formData.contact_person_email = this.addEditVendorForm.value.contact_person_email;
      this.formData.contact_person_mobile_no = this.addEditVendorForm.value.contact_person_mobile_no;
      this.commonService.update(`${this.base_url}`, this.id, this.formData).pipe(first()).subscribe({
        next: (response: any) => {
          this.toastr.success(response.message);
          this.router.navigate(["/main/vendor-master"]);
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
    this.addEditVendorForm.reset();
  }

}
