import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { GlobalConstants } from 'src/app/common/global-constants';
import { CommonService } from 'src/app/services/common.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-add-bankdetails-master',
  templateUrl: './add-bankdetails-master.component.html',
  styleUrls: ['./add-bankdetails-master.component.scss']
})
export class AddBankdetailsMasterComponent implements OnInit {
  readonly BANK_CONSTANT = GlobalConstants;
  base_url = 'bankdetails';
  common_upload_url = 'common/upload';
  bankData: any[] = [];
  selectedFile: any | null = null;
  docId!: string;
  id!: number;
  editdocId!: string;
  isAddMode!: boolean;
  bgType = [
    {
      name: 'Check'
    },
    {
      name: 'DD'
    },
    {
      name: 'NEFT'
    }
  ]
  formData = {
    bank_name: '',
    bank_branch: '',
    bank_ifsc_code: '',
    bank_address: '',
    vendor: '',
    bg_number: '',
    bg_doc_id: '',
    valid_till_date: '',
    tender: '',
    file_no: '',
    remarks: '',
    fieldArray: [],
    bg_type: '',
    amount: '',
    bg_type_number: ''
  }
  keyword = 'name';
  showTextbox: boolean = false;
  data!: { name: string; }[];
  ifscUrl = '/ifsc';
  addEditBankGuaranteeForm: FormGroup = new FormGroup({
    bank_name: new FormControl(''),
    bank_branch: new FormControl(''),
    bank_ifsc_code: new FormControl(''),
    bank_address: new FormControl(''),
    vendor: new FormControl(''),
    amount: new FormControl(''),
    file_no: new FormControl(''),
    tender: new FormControl(''),
    fieldArray: new FormArray([]),
  });
  submitted = false;
  documentName: any;
  imageUrl: any;
  fieldGroup!: FormGroup;
  bg_value: any;
  tendor_url = 'tendors';
  tendorData: any[] = [];
  vendor_url = 'vendors';
  vendorData: any[] = [];

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private commonService: CommonService,
    public datepipe: DatePipe,
    private router: Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.addEditBankGuaranteeForm = this.formBuilder.group(
      {
        bank_name: ['', Validators.required],
        bank_branch: ['', Validators.required],
        bank_ifsc_code: ['', Validators.required],
        bank_address: ['', Validators.required],
        vendor: ['', Validators.required],
        amount: ['', { validators: [Validators.required, Validators.minLength(5), Validators.maxLength(10)], updateOn: "blur" }],
        tender: ['', Validators.required],
        file_no: ['', Validators.required],
        fieldArray: this.formBuilder.array([])
      });

    this.getAllIFSC();
    this.getAllVendor();
    this.getAllTendor();
    // Create 3 fields initially
    if (this.isAddMode) {
      for (let i = 0; i < 1; i++) {
        this.addField();
      }
    }
    if (!this.isAddMode) {
      this.commonService.getById(`${this.base_url}`, this.id)
        .pipe(first())
        .subscribe((BankRes: any) => {
          this.showTextbox = BankRes.bg_type_number ? true : false;
          this.bg_value = BankRes.bg_type;
          this.formData.bank_name = BankRes.bank_name;
          this.formData.bank_branch = BankRes.bank_branch;
          this.formData.bank_ifsc_code = BankRes.bank_ifsc_code;
          this.formData.bank_address = BankRes.bank_address;
          this.formData.vendor = BankRes.vendor;
          this.formData.file_no = BankRes.file_no;
          this.formData.tender = BankRes.tender;
          this.formData.amount = BankRes.amount;
          this.editdocId = BankRes.bg_doc_id;
          this.documentName = BankRes.document_name;
          this.addField(BankRes);
          this.addEditBankGuaranteeForm.patchValue(this.formData)
        });
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.addEditBankGuaranteeForm.controls;
  }

  selectEvent(item: any) {
    // do something with selected item
    this.commonService.getByIFSC(`${this.base_url}${this.ifscUrl}`, item.name)
      .pipe(first())
      .subscribe((BankSearchDetails: any) => {
        this.addEditBankGuaranteeForm.patchValue({
          bank_name: BankSearchDetails.bankname,
          bank_branch: BankSearchDetails.branch
        })
      });
  }

  onDropdownChange(event: any) {
      this.showTextbox = this.bgType.some((val) => val.name === event.target.value);
      this.bg_value = event.target.value;
    if (!this.showTextbox) {
      this.fieldGroup.controls['bg_type_number'].reset();
      this.fieldGroup.controls['bg_type_number'].clearValidators();
      this.fieldGroup.controls['bg_type_number'].updateValueAndValidity();
    } else {
      if(this.bg_value === 'Check'){
        this.fieldGroup.controls['bg_type_number'].setValidators(Validators.compose([Validators.required, Validators.maxLength(5)]));
        this.fieldGroup.controls['bg_type_number'].updateValueAndValidity();
      }
      if(this.bg_value === 'DD'){
        this.fieldGroup.controls['bg_type_number'].setValidators(Validators.compose([Validators.required, Validators.maxLength(6)]));
        this.fieldGroup.controls['bg_type_number'].updateValueAndValidity();
      }
      if(this.bg_value === 'NEFT'){
        this.fieldGroup.controls['bg_type_number'].setValidators(Validators.compose([Validators.required, Validators.maxLength(22)]));
        this.fieldGroup.controls['bg_type_number'].updateValueAndValidity();
      }
    }
  }

  fileUpload() {
    const formData = new FormData();
    formData.append("image", this.selectedFile, this.selectedFile.name);
    this.commonService.CreateWithAuthUpload(`${this.common_upload_url}`, formData).pipe(first()).subscribe({
      next: (response: any) => {
        this.docId = response.docId;
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
    if (this.addEditBankGuaranteeForm.valid && (this.selectedFile !== null || this.docId || this.editdocId)) {
      // Form is valid, perform necessary actions
      this.formData.bank_name = this.addEditBankGuaranteeForm.value.bank_name;
      this.formData.bank_branch = this.addEditBankGuaranteeForm.value.bank_branch;
      this.formData.bank_ifsc_code = this.addEditBankGuaranteeForm.value.bank_ifsc_code;
      this.formData.bank_address = this.addEditBankGuaranteeForm.value.bank_address;
      this.formData.vendor = this.addEditBankGuaranteeForm.value.vendor;
      this.formData.file_no = this.addEditBankGuaranteeForm.value.file_no;
      this.formData.tender = this.addEditBankGuaranteeForm.value.tender;
      this.formData.amount = this.addEditBankGuaranteeForm.value.amount;
      
      if (this.selectedFile !== null) {
        this.fileUpload();
      }

      setTimeout(() => {
        if (this.isAddMode) {
          this.formData.bg_number = this.addEditBankGuaranteeForm.value.fieldArray[0].bg_number;
          this.formData.bg_doc_id = this.docId;
          this.formData.bg_type = this.addEditBankGuaranteeForm.value.fieldArray[0].bg_type;
          this.formData.remarks = this.addEditBankGuaranteeForm.value.fieldArray[0].remarks;
          this.formData.valid_till_date = this.addEditBankGuaranteeForm.value.fieldArray[0].valid_till_date;
          this.formData.bg_type_number = this.addEditBankGuaranteeForm.value.fieldArray[0].bg_type_number;
          this.createbankGuarantee(this.formData);
        }
        if (!this.isAddMode && this.id) {
          if (this.addEditBankGuaranteeForm.value.fieldArray.length > 1) {
            this.formData.bg_number = this.addEditBankGuaranteeForm.value.fieldArray[1].bg_number;
            this.formData.bg_doc_id = this.docId;
            this.formData.bg_type = this.addEditBankGuaranteeForm.value.fieldArray[1].bg_type;
            this.formData.remarks = this.addEditBankGuaranteeForm.value.fieldArray[1].remarks;
            this.formData.valid_till_date = this.addEditBankGuaranteeForm.value.fieldArray[1].valid_till_date;
            this.formData.bg_type_number = this.addEditBankGuaranteeForm.value.fieldArray[1].bg_type_number;
          } else {
            this.formData.bg_number = this.addEditBankGuaranteeForm.value.fieldArray[0].bg_number;
            this.formData.bg_doc_id = this.editdocId;
            this.formData.remarks = this.addEditBankGuaranteeForm.value.fieldArray[0].remarks;
            this.formData.bg_type = this.addEditBankGuaranteeForm.value.fieldArray[0].bg_type;
            this.formData.valid_till_date = this.addEditBankGuaranteeForm.value.fieldArray[0].valid_till_date;
            this.formData.bg_type_number = this.addEditBankGuaranteeForm.value.fieldArray[0].bg_type_number;
          }
          this.updateBankGuarantee(this.formData);
        }
      }, 5000);
    } else {
      // Form is invalid, display validation errors
      this.addEditBankGuaranteeForm.markAllAsTouched();
      if (this.selectedFile === null && !this.id) {
        this.toastr.error("please upload file")
      }
    }
  }

  get fieldArray(): FormArray {
    return this.addEditBankGuaranteeForm.get('fieldArray') as FormArray;
  }

  addField(BankRes?: any): void {
    this.fieldGroup = this.formBuilder.group({
      bg_number: ['', Validators.required],
      bg_doc: [''],
      valid_till_date: ['', Validators.required],
      remarks: ['', Validators.required],
      bg_type: ['', Validators.required],
      bg_type_number: ['', { validators: null, updateOn: 'blur' }]
    });
    if (BankRes) {
      const { bg_number, bg_doc_id, remarks, valid_till_date, bg_type, bg_type_number } = BankRes;
      //console.log(valid_till_date);
      var edit_valid_till_date = new Date(valid_till_date).toDateString();
      var utcMonth: any = new Date(edit_valid_till_date).getMonth() + 1;
      var utcDate: any = new Date(edit_valid_till_date).getDate();
      var year: any = new Date(edit_valid_till_date).getFullYear()
      if (utcMonth < 10) {
        utcMonth = utcMonth.toString().padStart(2, '0');
      }
      if (utcDate < 10) {
        utcDate = utcDate.toString().padStart(2, '0');
      }
      
          
      var res_valid_till_date = year + "-" + (utcMonth) +
        "-" + utcDate;
        this.fieldGroup.patchValue({
        bg_doc: bg_doc_id,
        bg_number: bg_number,
        remarks: remarks,
        valid_till_date: res_valid_till_date as string,
        bg_type: bg_type,
        bg_type_number: bg_type_number
      });
      this.fieldArray.push(this.fieldGroup);
    } else {
      if(!this.isAddMode){
        this.showTextbox = false;
      }
      this.fieldArray.push(this.fieldGroup);
    }
  }

  getAllIFSC(): void {
    this.commonService.getAll(`${this.base_url}${this.ifscUrl}`)
      .subscribe({
        next: (response: any) => {
          var resultData: any[] = [];
          response.data.map((item: any) => {
            resultData.push({ name: item.IFSC });
          })
          this.data = resultData;
        },
        error: (err: any) => {
          this.toastr.error(err.error.message);
        }
      });
  }

  getAllTendor(): void {
    this.commonService.getAll(`${this.tendor_url}`)
      .subscribe({
        next: (response: any) => {
          var resultData: any[] = [];
          response.data.map((item: any) => {
            resultData.push({id: item.id, name: item.tendor_name });
          })
          this.tendorData = resultData;
        },
        error: (err: any) => {
          this.toastr.error(err.error.message);
        }
      });
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

  removeField(index: number): void {
    this.fieldArray.removeAt(index);
    this.fieldArray.clearValidators();
  }

  createbankGuarantee(formRes: any) {
    try {
      this.commonService.CreateWithAuth(`${this.base_url}`, formRes).pipe(first()).subscribe({
        next: (response: any) => {
          console.log(response);
          this.toastr.success(response.message);
          this.router.navigate(["/main/bank-guarantee-master"]);
        },
        error: (err: any) => {
          console.log(err);
          this.toastr.error(err.error.message);
        },
        complete: () => console.log('completed')
      });
    } catch (error: any) {
      this.toastr.error(error.message);
    }
  }

  updateBankGuarantee(formRes: any) {
    try {
      this.commonService.update(`${this.base_url}`, this.id, formRes).pipe(first()).subscribe({
        next: (response: any) => {
          this.toastr.success(response.message);
          this.router.navigate(["/main/bank-guarantee-master"]);
        },
        error: (err: any) => {
          this.toastr.error(err.error.message);
        },
        complete: () => console.log('completed')
      });
    } catch (err: any) {
      this.toastr.error(err.error ? err.error.message : err.message);
    }
  }

  onFileChange(event: any) {
    const inputElement = event.target;
    if (inputElement.files && inputElement.files.length) {
      this.selectedFile = inputElement.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  onReset(): void {
    this.submitted = false;
    this.addEditBankGuaranteeForm.reset();
  }

}
