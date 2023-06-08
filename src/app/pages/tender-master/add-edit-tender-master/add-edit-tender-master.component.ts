import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { GlobalConstants } from 'src/app/common/global-constants';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-add-edit-tender-master',
  templateUrl: './add-edit-tender-master.component.html',
  styleUrls: ['./add-edit-tender-master.component.scss']
})
export class AddEditTenderMasterComponent implements OnInit {
  readonly TENDOR_CONSTANT = GlobalConstants;
  base_url = 'tendors';
  id!: number;
  isAddMode!: boolean;
  selectedFile: any | null = null;
  workOrderselectedFile: any | null = null;
  common_upload_url = 'common/upload';
  docId!: string;
  tendorDocId!: string;
  workOrderId!: string;
  addEditTendorForm: FormGroup = new FormGroup({
    tendor_name: new FormControl(''),
    tendor_number: new FormControl(''),
    tendor_document: new FormControl(''),
    work_order_issue_date: new FormControl(''),
    work_order_no: new FormControl(''),
    work_order_document: new FormControl(''),
  });
  submitted = false;
  formData: any = {
    tendor_name: '',
    tendor_number: '',
    tendor_document_id: '',
    work_order_issue_date: '',
    work_order_no: '',
    work_order_document_id: ''
  }
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private commonService: CommonService,
    private router: Router) {
    }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.addEditTendorForm = this.formBuilder.group(
      {
        tendor_name: ['', Validators.required],
        tendor_number: ['', Validators.required],
        tendor_document: [''],
        work_order_issue_date: ['', Validators.required],
        work_order_no: ['', Validators.required],
        work_order_document: ['']
      },
    );

    if (!this.isAddMode) {
      this.commonService.getById(`${this.base_url}`, this.id)
        .pipe(first())
        .subscribe(x => {
          this.formData.tendor_name = x.tendor_name;
          this.formData.tendor_number = x.tendor_number;
          this.formData.tendor_document_id = x.tendor_document_id;
          const work_order_issue_date = x.work_order_issue_date;
          var edit_work_order_issue_date = new Date(work_order_issue_date).toDateString();
          var utcMonth: any = new Date(edit_work_order_issue_date).getMonth() + 1;
          var utcDate: any = new Date(edit_work_order_issue_date).getDate();
           var year: any = new Date(edit_work_order_issue_date).getFullYear()
          if(utcMonth < 10){
            utcMonth = utcMonth.toString().padStart(2, '0');
          }
          if(utcDate < 10){
            utcDate = utcDate.toString().padStart(2, '0');
          }
          var res_edit_work_order_issue_date = year  + "-" + (utcMonth) +
          "-" + utcDate;
          this.formData.work_order_issue_date = res_edit_work_order_issue_date;
          this.formData.work_order_no = x.work_order_no;
          this.formData.work_order_document_id = x.work_order_document_id;
          this.addEditTendorForm.patchValue(this.formData)
        });
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.addEditTendorForm.controls;
  }

  tendorDocumentImage(){
    const formData = new FormData();
    formData.append("image", this.selectedFile, this.selectedFile.name);
    this.commonService.CreateWithAuthUpload(`${this.common_upload_url}`, formData).pipe(first()).subscribe({
      next: (response: any) => {
        this.tendorDocId = response.docId;
        //this.formData.bg_doc_id = this.docId;
        //this.toastr.success(response.message);
        //this.router.navigate(["/main/bank-guarantee-master"]);
      },
      error: (err: any) => {
        //console.log(err);
        this.toastr.error(err.message);
      },
      complete: () => console.log('completed')
    });
  }

  WorkOrderImage(){
    const formData = new FormData();
    formData.append("image", this.workOrderselectedFile, this.workOrderselectedFile.name);
    this.commonService.CreateWithAuthUpload(`${this.common_upload_url}`, formData).pipe(first()).subscribe({
      next: (response: any) => {
        this.workOrderId = response.docId;
        //this.formData.bg_doc_id = this.docId;
        //this.toastr.success(response.message);
        //this.router.navigate(["/main/bank-guarantee-master"]);
      },
      error: (err: any) => {
        //console.log(err);
        this.toastr.error(err.message);
      },
      complete: () => console.log('completed')
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.addEditTendorForm.invalid) {
      return;
    }
    this.formData.tendor_name = this.addEditTendorForm.value.tendor_name;
    this.formData.tendor_number = this.addEditTendorForm.value.tendor_number;
     //console.log(valid_till_date);
    this.formData.work_order_issue_date = this.addEditTendorForm.value.work_order_issue_date;
    this.formData.work_order_no = this.addEditTendorForm.value.work_order_no;
    if(this.selectedFile !== null){
      this.tendorDocumentImage();
    }

    if(this.workOrderselectedFile !== null){
        this.WorkOrderImage();
    }
   
   

    setTimeout(() => {
      if (this.isAddMode) {
        this.formData.tendor_document_id = this.tendorDocId;
        this.formData.work_order_document_id = this.workOrderId;
        this.createTendor();
      } else {
        this.updateTendor();
      }
    }, 3000);
    
  }

  //Create Vendor
  private createTendor() {
    try {
      this.commonService.CreateWithAuth(`${this.base_url}`, this.formData).pipe(first()).subscribe({
        next: (response: any) => {
          this.toastr.success(response.message);
          this.router.navigate(["/main/tendor-master"]);
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

  //Update Tendor
  private updateTendor() {
    try {
      this.commonService.update(`${this.base_url}`, this.id, this.formData).pipe(first()).subscribe({
        next: (response: any) => {
          this.toastr.success(response.message);
          this.router.navigate(["/main/tendor-master"]);
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

  onFileChange(event: any) {
    const inputElement = event.target;
    console.log(inputElement.files[0]);
    if (inputElement.files && inputElement.files.length) {
      this.selectedFile = inputElement.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  onWorkOrderFileChange(event: any) {
    const inputElement = event.target;
    if (inputElement.files && inputElement.files.length) {
      this.workOrderselectedFile = inputElement.files[0];
    } else {
      this.workOrderselectedFile = null;
    }
  }

  getImage() {
    this.commonService.getImageFromCouchDB(`${this.base_url}`, this.id)
    .pipe(first())
    .subscribe(x => {
      console.log(x);
    });
  }


  onReset(): void {
    this.submitted = false;
    this.addEditTendorForm.reset();
  }

}
