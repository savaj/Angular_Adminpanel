import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { GlobalConstants } from 'src/app/common/global-constants';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-add-edit-bg-return',
  templateUrl: './add-edit-bg-return.component.html',
  styleUrls: ['./add-edit-bg-return.component.scss']
})
export class AddEditBgReturnComponent implements OnInit {
  readonly BG_CONSTANT = GlobalConstants;
  base_url = 'bankdetailsReturn';
  common_upload_url = 'common/upload';
  bgReturnData: any[] = [];
  isLoading = false;
  selectedFile: any | null = null;
  docId!: string;
  id!: number;
  editdocId!: string;
  isAddMode!: boolean;
  formData = {
    bank_id: '',
    return_date: '',
    contact_person_name: '',
    contact_person_email: '',
    signed_copy_document_id: '',
    utr_number: '',
  }
  submitted = false;
  isValidExtension: boolean = false;
  addEditBgReturnForm: FormGroup = new FormGroup({
    bank_id: new FormControl(''),
    return_date: new FormControl(''),
    contact_person_name: new FormControl(''),
    contact_person_email: new FormControl(''),
    signed_copy_document_id: new FormControl(''),
    utr_number: new FormControl(''),
  });
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private commonService: CommonService,
    public datepipe: DatePipe,
    private spinner: NgxSpinnerService,
    private router: Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;
    this.addEditBgReturnForm = this.formBuilder.group(
      {
        bank_id: ['', Validators.required],
        return_date: ['', Validators.required],
        contact_person_name: [''],
        contact_person_email: [''],
        signed_copy_document_id: [''],
        utr_number: ['']
      });
    if (!this.isAddMode) {
      this.commonService.getById(`${this.base_url}`, this.id)
        .pipe(first())
        .subscribe((BgReturnRes: any) => {

        });
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.addEditBgReturnForm.controls;
  }

  onFileChange(event: any) {
    const inputElement = event.target;
    if (inputElement.files && inputElement.files.length) {
      const allowedExtensions = ['pdf'];
      const file = inputElement.files[0];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      this.isValidExtension = allowedExtensions.includes(fileExtension);
      if (this.isValidExtension === false) {
        this.selectedFile = { invalidExtension: true };
        if (this.selectedFile.invalidExtension === true) {
          this.toastr.error('please upload bg document pdf only')
          this.selectedFile = null;
        }
      } else {
        this.selectedFile = inputElement.files[0];
      }
    } else {
      this.selectedFile = null;
    }
  }

  fileUpload() {
    const formData = new FormData();
    formData.append("image", this.selectedFile, this.selectedFile.name);
    this.commonService.CreateWithAuthUpload(`${this.common_upload_url}`, formData).pipe(first()).subscribe({
      next: (response: any) => {
        this.docId = response.docId;
      },
      error: (err: any) => {
        this.toastr.error(err.message);
      },
      complete: () => {
        console.log('completed');
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.addEditBgReturnForm.valid && (this.selectedFile !== null || this.docId)) {
      setTimeout(() => {
        if (this.isAddMode) {        
          this.createbgReturn();
        } else {
          this.updatebgReturn();
        }
      }, 5000);
    } else {
      // Form is invalid, display validation errors
      this.addEditBgReturnForm.markAllAsTouched();
      if (this.selectedFile === null && !this.id) {
        this.toastr.error("please upload file")
      }
    }
  }

  createbgReturn() {
    try {
      this.commonService.CreateWithAuth(`${this.base_url}`, this.formData).pipe(first()).subscribe({
        next: (response: any) => {
          this.spinner.hide();
          this.toastr.success(response.message);
          this.router.navigate(["/main/bg-return"]);
        },
        error: (err: any) => {
          this.spinner.hide();
          this.toastr.error(err.error.message);
        },
        complete: () => {
        }
      });
    } catch (error: any) {
      this.toastr.error(error.message);
    }
  }

  updatebgReturn() {
    try {
      this.commonService.update(`${this.base_url}`, this.id, this.formData).pipe(first()).subscribe({
        next: (response: any) => {
          this.spinner.hide();
          this.toastr.success(response.message);
          this.router.navigate(["/main/bg-return"]);
        },
        error: (err: any) => {
          this.spinner.hide();
          this.toastr.error(err.error.message);
        },
        complete: () => {
        }
      });
    } catch (err: any) {
      this.toastr.error(err.error ? err.error.message : err.message);
    }
  }

}
