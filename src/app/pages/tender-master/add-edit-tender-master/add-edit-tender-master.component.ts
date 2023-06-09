import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { GlobalConstants } from 'src/app/common/global-constants';
import { CommonService } from 'src/app/services/common.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-add-edit-tender-master',
  templateUrl: './add-edit-tender-master.component.html',
  styleUrls: ['./add-edit-tender-master.component.scss']
})
export class AddEditTenderMasterComponent implements OnInit {
  //Tender Constants
  readonly TENDOR_CONSTANT = GlobalConstants;

  //Edit Configuration Param
  id!: number;
  isAddMode!: boolean;

  //File Object
  selectedFile: any | null = null;
  workOrderselectedFile: any | null = null;

  //url Configuration
  base_url = 'tendors';

  //file Upload
  common_upload_url = 'common/upload';
  docId!: string;
  tendorDocId: string = '';
  workOrderId: string = '';

  //Spinner Initial Default value
  isLoading = false;

  //FormGroup Tender Add/Edit Form
  addEditTendorForm: FormGroup = new FormGroup({
    tendor_name: new FormControl(''),
    tendor_number: new FormControl(''),
    tendor_document: new FormControl(''),
    work_order_issue_date: new FormControl(''),
    work_order_no: new FormControl(''),
    work_order_document: new FormControl(''),
    vendor: new FormControl(''),
    file_no: new FormControl(''),
  });
  vendor_url = 'vendors';
  vendorData: any[] = [];

  //Submitted Value Flag
  submitted = false;

  //Submit Data Object
  formData: any = {
    tendor_name: '',
    tendor_number: '',
    tendor_document_id: '',
    work_order_issue_date: '',
    work_order_no: '',
    work_order_document_id: '',
    vendor: '',
    file_no: ''
  }

  //Check valid Extension
  isValidExtension: boolean = false;

  //Dependency Injection
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private router: Router) {
  }

  //Initial Configuration
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
        work_order_document: [''],
        vendor: ['', Validators.required],
        file_no: ['', Validators.required]
      },
    );
    this.getAllVendor();
    if (!this.isAddMode) {
      this.commonService.getById(`${this.base_url}`, this.id)
        .pipe(first())
        .subscribe(x => {
          this.spinner.show();
          this.formData.tendor_name = x.tendor_name;
          this.formData.tendor_number = x.tendor_number;
          this.formData.tendor_document_id = x.tendor_document_id;
          this.formData.vendor = x.vendor_id;
          this.formData.file_no = x.file_no;
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
          this.spinner.hide();  
          this.addEditTendorForm.patchValue(this.formData)          
        });
    }
  }

  //Get FormControl
  get f(): { [key: string]: AbstractControl } {
    return this.addEditTendorForm.controls;
  }

  getAllVendor(): void {
    this.commonService.getAll(`${this.vendor_url}`)
      .subscribe({
        next: (response: any) => {
          var resultData: any[] = [];
          response.data.map((item: any) => {
            resultData.push({ id: item.id, name: item.vendor_name });
          })
          this.vendorData = resultData;
        },
        error: (err: any) => {
          this.toastr.error(err.error.message);
        }
      });
  }
  //Tender Document Image
  tendorDocumentImage(){
    const formData = new FormData();
    formData.append("image", this.selectedFile, this.selectedFile.name);
    this.commonService.CreateWithAuthUpload(`${this.common_upload_url}`, formData).pipe(first()).subscribe({
      next: (response: any) => {
        this.tendorDocId = response.docId;
      },
      error: (err: any) => {
        this.toastr.error(err.message);
      }
    });
  }

  //Work Order Document Image
  WorkOrderImage(){
    const formData = new FormData();
    formData.append("image", this.workOrderselectedFile, this.workOrderselectedFile.name);
    this.commonService.CreateWithAuthUpload(`${this.common_upload_url}`, formData).pipe(first()).subscribe({
      next: (response: any) => {
        this.workOrderId = response.docId;
      },
      error: (err: any) => {
        this.toastr.error(err.message);
      }
    });
  }

  

  //Final Submitted Data
  onSubmit(): void {
    this.submitted = true;
    if((this.selectedFile === null && !this.id) || (this.formData.tendor_document_id === '' && this.id)){
      this.toastr.error('please upload tender document and valid document');
      return;
    }
    if((this.workOrderselectedFile === null && !this.id) || (this.formData.work_order_document_id === '' && this.id)){
      this.toastr.error('please upload work order document and valid document');
      return;
    }
  
    if (this.addEditTendorForm.invalid) {
      return;
    }
    this.formData.tendor_name = this.addEditTendorForm.value.tendor_name;
    this.formData.tendor_number = this.addEditTendorForm.value.tendor_number;
    this.formData.work_order_issue_date = this.addEditTendorForm.value.work_order_issue_date;
    this.formData.work_order_no = this.addEditTendorForm.value.work_order_no;
    this.formData.vendor = this.addEditTendorForm.value.vendor;
    this.formData.file_no = this.addEditTendorForm.value.file_no;
    if(this.selectedFile !== null){
          this.tendorDocumentImage();
    }

    
    if(this.workOrderselectedFile !== null){
        this.WorkOrderImage();
    }
   
    this.isLoading = true;
    this.spinner.show();
    setTimeout(() => {
      this.formData.tendor_document_id = this.tendorDocId !== '' ? this.tendorDocId  : this.formData.tendor_document_id;
      this.formData.work_order_document_id = this.workOrderId !== '' ? this.workOrderId : this.formData.work_order_document_id;
      if (this.isAddMode) {        
        this.createTendor();
      } else {
        this.updateTendor();
      }
    }, 5000);
    
  }

  //Create Vendor
  private createTendor() {
    try {
      this.commonService.CreateWithAuth(`${this.base_url}`, this.formData).pipe(first()).subscribe({
        next: (response: any) => {
          this.toastr.success(response.message);
          this.router.navigate(["/main/tender-master"]);
        },
        error: (err: any) => {
          this.toastr.error(err.error.message);
        },
        complete: () => {
          this.spinner.hide();
        }
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
          this.router.navigate(["/main/tender-master"]);
        },
        error: (err: any) => {
          this.toastr.error(err.error.message);
        },
        complete: () => {
          this.spinner.hide();
        }
      });
    } catch (error: any) {
      this.toastr.error(error.message);
    }
  }

  //Tendor Document Upload
  onFileChange(event: any) {
    const inputElement = event.target;
    if (inputElement.files && inputElement.files.length) {
        const allowedExtensions = ['pdf'];
        const file = inputElement.files[0]; 
        const fileExtension = file.name.split('.').pop().toLowerCase();
        this.isValidExtension = allowedExtensions.includes(fileExtension);
        if(this.isValidExtension === false){
          this.selectedFile = {invalidExtension : true};
          if(this.selectedFile.invalidExtension === true){
            this.toastr.error('please upload tender document pdf only')
            this.selectedFile = null;
          }
        }else {
          this.selectedFile = inputElement.files[0];
        }      
    } else {
      this.selectedFile = null;
    }
  }

  //Work Order Document Upload
  onWorkOrderFileChange(event: any) {
    const inputElement = event.target;
    if (inputElement.files && inputElement.files.length) {
      const allowedExtensions = ['pdf'];
      const file = inputElement.files[0]; 
      const fileExtension = file.name.split('.').pop().toLowerCase();
      this.isValidExtension = allowedExtensions.includes(fileExtension);
      if(this.isValidExtension === false){
        this.workOrderselectedFile = {invalidExtension : true};
        if(this.workOrderselectedFile.invalidExtension === true){
          this.toastr.error('please upload workorder document pdf only')
          this.workOrderselectedFile = null;
        }
      }else {
        this.workOrderselectedFile = inputElement.files[0];
      }   
    } else {
      this.workOrderselectedFile = null;
    }
  }

  //Page Reset
  onReset(): void {
    this.submitted = false;
    this.addEditTendorForm.reset();
  }

}
