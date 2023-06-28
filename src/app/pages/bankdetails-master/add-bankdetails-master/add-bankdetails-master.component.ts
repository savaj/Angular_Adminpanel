import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { GlobalConstants } from 'src/app/common/global-constants';
import { CommonService } from 'src/app/services/common.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-bankdetails-master',
  templateUrl: './add-bankdetails-master.component.html',
  styleUrls: ['./add-bankdetails-master.component.scss']
})
export class AddBankdetailsMasterComponent implements OnInit {
  readonly BANK_CONSTANT = GlobalConstants;
  base_url = 'bankdetails';
  isLoading = false;
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
    // bg_number: '',
    // bg_doc_id: '',
    // valid_till_date: '',
    tender: '',
    file_no: '',
    // remarks: '',
    fieldArray: [],
    // bg_type: '',
    amount: '',
    status: ''
    // bg_type_number: ''
  }
  keyword = 'name';
  showTextbox: any[] = [];
  res_valid_till_date!: string;
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
  docIdArray: any[] = [];
  status: any = 'pending';
  is_lock: any;
  isValidExtension: boolean = false;
  isDisabled: any[] = [];
  bgArray: any[] = [];
  currentDate!: string;

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
    var dateRes: any = new Date().toDateString();
    var utcMonth: any = new Date(dateRes).getMonth() + 1;
           var utcDate: any = new Date(dateRes).getDate();
           var year = new Date(dateRes).getFullYear()
         if (utcMonth < 10) {
           utcMonth = utcMonth.toString().padStart(2, '0');
         }
         if (utcDate < 10) {
           utcDate = utcDate.toString().padStart(2, '0');
         }
   
         this.currentDate = year + "-" + (utcMonth) +
           "-" + utcDate;
    this.addEditBankGuaranteeForm = this.formBuilder.group(
      {
        bank_name: ['', Validators.required],
        bank_branch: ['', Validators.required],
        bank_ifsc_code: ['', Validators.required],
        bank_address: ['', Validators.required],
        vendor: ['', Validators.required],
        amount: ['', { validators: [Validators.required, Validators.pattern("^[0-9]+$"), Validators.minLength(5), Validators.maxLength(10)], updateOn: "blur" }],
        tender: ['', Validators.required],
        file_no: ['', Validators.required],
        fieldArray: this.formBuilder.array([])
      });
      // this.addEditBankGuaranteeForm.controls['vendor'].disable();

    this.getAllIFSC();
    this.getAllVendor();
    this.getAllTendor();
    // Create 3 fields initially
    if (this.isAddMode) {
      for (let i = 0; i < 1; i++) {
        this.addField('', i);
      }
    }
    if (!this.isAddMode) {
      this.commonService.getById(`${this.base_url}`, this.id)
        .pipe(first())
        .subscribe((BankRes: any) => {
          
          
          this.bg_value = BankRes.bg_type;
          this.formData.bank_name = BankRes.bank_name;
          this.formData.bank_branch = BankRes.bank_branch;
          this.formData.bank_ifsc_code = BankRes.bank_ifsc_code;
          this.formData.bank_address = BankRes.bank_address;
          this.formData.vendor = BankRes.vendor;
          this.formData.file_no = BankRes.file_no;
          this.formData.tender = BankRes.tender;
          this.formData.amount = BankRes.amount;
          this.status = BankRes.bank_detail_status;
          if(this.status === 'pending'){
              this.addEditBankGuaranteeForm.controls['tender'].disable();
          } else {
              this.addEditBankGuaranteeForm.controls['tender'].enable();
          }
          this.is_lock = BankRes.is_lock;
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

  onDropdownChange(event: any, index: any) {
      this.showTextbox[index] = this.bgType.some((val) => val.name === event.target.value);
      this.bg_value = event.target.value;
    if (!this.showTextbox) {
      this.fieldGroup.controls['bg_type_number'].reset();
      this.fieldGroup.controls['bg_type_number'].clearValidators();
      this.fieldGroup.controls['bg_type_number'].updateValueAndValidity();
    } else {
      if(this.bg_value === 'Check'){
        this.fieldGroup.controls['bg_type_number'].setValidators(Validators.compose([Validators.required, Validators.pattern("^[0-9]+$"), Validators.maxLength(5)]));
        this.fieldGroup.controls['bg_type_number'].updateValueAndValidity();
      }
      if(this.bg_value === 'DD'){
        this.fieldGroup.controls['bg_type_number'].setValidators(Validators.compose([Validators.required, Validators.pattern("^[0-9]+$"), Validators.maxLength(6)]));
        this.fieldGroup.controls['bg_type_number'].updateValueAndValidity();
      }
      if(this.bg_value === 'NEFT'){
        this.fieldGroup.controls['bg_type_number'].setValidators(Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9]+$"), Validators.maxLength(23)]));
        this.fieldGroup.controls['bg_type_number'].updateValueAndValidity();
      }
    }
  }

  ontenderChange(event: any){
    const tendorId = event.target.value;
    this.commonService.getAll(`${this.tendor_url}/${tendorId}`)
      .subscribe({
        next: (response: any) => {
          const { vendor_name, file_no } = response;
          this.addEditBankGuaranteeForm.patchValue({
            vendor: vendor_name,
            file_no: file_no
          })
        },
        error: (err: any) => {
          this.toastr.error(err.error.message);
        }
      });
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
    if (this.addEditBankGuaranteeForm.valid && (this.selectedFile !== null || this.docId || this.docIdArray)) {
      // Form is valid, perform necessary actions
      // this.addEditBankGuaranteeForm.controls['vendor'].enable();
      this.formData.bank_name = this.addEditBankGuaranteeForm.value.bank_name;
      this.formData.bank_branch = this.addEditBankGuaranteeForm.value.bank_branch;
      this.formData.bank_ifsc_code = (!this.addEditBankGuaranteeForm.value.bank_ifsc_code?.name) ? this.formData.bank_ifsc_code :
      this.addEditBankGuaranteeForm.value.bank_ifsc_code.name;
      this.formData.bank_address = (!this.addEditBankGuaranteeForm.value.bank_address) ? this.formData.bank_address : this.addEditBankGuaranteeForm.value.bank_address;
      this.formData.vendor  = (!this.addEditBankGuaranteeForm.value.vendor) ? this.formData.vendor : this.addEditBankGuaranteeForm.value.vendor;
      this.formData.file_no = (!this.addEditBankGuaranteeForm.value.file_no) ? this.formData.file_no : this.addEditBankGuaranteeForm.value.file_no;
      this.formData.tender  = (!this.addEditBankGuaranteeForm.value.tender) ? this.formData.tender : this.addEditBankGuaranteeForm.value.tender;
      this.formData.amount  = (!this.addEditBankGuaranteeForm.value.amount) ? this.formData.amount : this.addEditBankGuaranteeForm.value.amount;
      //this.spinner.show();
      this.isLoading = true;
      if(this.isAddMode){
        if (this.selectedFile !== null) {
          //setTimeout(() => {
            this.fileUpload();
          //}, 1500);
        }
      } else {
        if (this.selectedFile !== null) {
          //setTimeout(() => {
            this.fileUpload();
          //}, 1500);
        }
      }
      setTimeout(() => {
        if (this.isAddMode) {
          this.addEditBankGuaranteeForm.value.fieldArray.map((val: any) => {
              if(this.docId !== undefined){
                val.bg_doc_id = this.docId;
                val.bg_doc = this.docId;
              } else {
                val.bg_doc_id = '';    
              }
              
          })
          this.formData.fieldArray = this.addEditBankGuaranteeForm.value.fieldArray;
          if(this.formData.fieldArray[0]['bg_doc_id'] === '' || this.formData.fieldArray[0]['bg_doc_id'] === undefined){
              this.toastr.error('please upload file');
              this.spinner.hide();
          } else {
            this.createbankGuarantee(this.formData);
          }
        }
        if (!this.isAddMode && this.id) {
          if(this.status === 'approved' || this.status === 'rejected'){
              this.addEditBankGuaranteeForm.value.fieldArray.map((val: any, index: any) => {
                if(this.bgArray.length !== this.fieldArray.length){
                    this.bgArray = [];
                    this.docIdArray.map((valDoc) => {
                      val.bg_doc = val.bg_doc !== valDoc ? valDoc : val.bg_doc; 
                    })
                  this.bgArray.push(val);
                } else {
                  this.bgArray.map((bgValMore) => {
                      val.bg_number = val.bg_number !== bgValMore.bg_number ? bgValMore.bg_number : val.bg_number;
                      val.bg_type = val.bg_type !== bgValMore.bg_type ? bgValMore.bg_type : val.bg_type;
                      val.bg_type_number = val.bg_type_number !== bgValMore.bg_type_number ? bgValMore.bg_type_number : val.bg_type_number;
                      val.remarks = val.remarks !== bgValMore.remarks ? bgValMore.remarks : val.remarks;
                      val.valid_till_date = val.valid_till_date !== bgValMore.valid_till_date ? bgValMore.valid_till_date : val.valid_till_date;
                      val.bg_doc = val.bg_doc;
                  })
                }
            });
          } else {
              this.addEditBankGuaranteeForm.value.fieldArray.map((val: any, index: any) => {
                if(val.bg_doc === '' || val.bg_doc === undefined){
                  this.toastr.error('please upload file');
                  this.spinner.hide();
                }else {            
                this.docIdArray.map((valDoc) => {
                  val.bg_doc = val.bg_doc !== valDoc ? valDoc : val.bg_doc; 
                })
                this.formData.status = this.status;
                this.bgArray.map((bgValMore) => {
                  val.bg_number = val.bg_number !== bgValMore.bg_number ? bgValMore.bg_number : val.bg_number;
                  val.bg_type = val.bg_type !== bgValMore.bg_type ? bgValMore.bg_type : val.bg_type;
                  val.bg_type_number = val.bg_type_number !== bgValMore.bg_type_number ? bgValMore.bg_type_number : val.bg_type_number;
                  val.remarks = val.remarks !== bgValMore.remarks ? bgValMore.remarks : val.remarks;
                  val.valid_till_date = val.valid_till_date !== bgValMore.valid_till_date ? bgValMore.valid_till_date : val.valid_till_date;
                })
                }
              })
          }

          if(this.bgArray.length !== this.fieldArray.length && (this.status === 'approved' || this.status === 'rejected')){
            this.addEditBankGuaranteeForm.value.fieldArray.shift();
          }
          this.formData.status = this.status;
          this.formData.fieldArray = this.addEditBankGuaranteeForm.value.fieldArray;
          //console.log('main', this.formData);
          // this.spinner.show();
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

  addField(BankRes?: any, i?: any): void {
    this.fieldGroup = this.formBuilder.group({
      bg_number: ['', Validators.required],
      bg_doc: [''],
      valid_till_date: ['', Validators.required],
      remarks: ['', Validators.required],
      bg_type: ['', Validators.required],
      bg_type_number: ['', { validators: null, updateOn: 'blur' }]
    });
    if (BankRes) {
      const { fieldArray } = BankRes;
      fieldArray.forEach((bg: any, index: number) => {
        this.showTextbox[index] = true;
        var edit_valid_till_date = new Date(bg.valid_till_date).toDateString();
        var utcMonth: any = new Date(edit_valid_till_date).getMonth() + 1;
        var utcDate: any = new Date(edit_valid_till_date).getDate();
        var year: any = new Date(edit_valid_till_date).getFullYear()
      if (utcMonth < 10) {
        utcMonth = utcMonth.toString().padStart(2, '0');
      }
      if (utcDate < 10) {
        utcDate = utcDate.toString().padStart(2, '0');
      }

      this.res_valid_till_date = year + "-" + (utcMonth) +
        "-" + utcDate;
          this.fieldGroup = this.formBuilder.group({
            bg_doc: [bg.bg_doc_id],
            bg_number: [bg.bg_number],
            remarks: [bg.remarks],
            valid_till_date: [this.res_valid_till_date as string],
            bg_type: [bg.bg_type],
            bg_type_number: [bg.bg_type_number]
          });
          
          this.isDisabled[index] = true;
          // this.fieldGroup.controls['bg_number']
          this.docIdArray.push(bg.bg_doc_id);
          this.bgArray.push({
            bg_number: bg.bg_number,
            remarks: bg.remarks,
            valid_till_date: this.res_valid_till_date,
            bg_type: bg.bg_type,
            bg_type_number: bg.bg_type_number
          })
          this.fieldGroup.controls['bg_number'].disable();
          this.fieldGroup.controls['remarks'].disable();
          this.fieldGroup.controls['valid_till_date'].disable();
          this.fieldGroup.controls['bg_type'].disable();
          this.fieldGroup.controls['bg_type_number'].disable();
          this.fieldArray.push(this.fieldGroup);
      })
       
    } else {
      this.isDisabled[i] = false;
      this.fieldGroup.controls['bg_number'].enable();
      this.fieldGroup.controls['remarks'].enable();
      this.fieldGroup.controls['valid_till_date'].enable();
      this.fieldGroup.controls['bg_type'].enable();
      this.fieldGroup.controls['bg_type_number'].enable();
      if(!this.isAddMode){
        this.showTextbox[i] = false;
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
    var id = 1;
    if(this.isAddMode){
        id = 0;
    }
    this.commonService.getAll(`${this.tendor_url}/all/${id}`)
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
          this.spinner.hide();
          this.toastr.success(response.message);
          this.router.navigate(["/main/bank-guarantee-master"]);
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

  updateBankGuarantee(formRes: any) {
    try {
      this.commonService.update(`${this.base_url}`, this.id, formRes).pipe(first()).subscribe({
        next: (response: any) => {
          this.spinner.hide();
          this.toastr.success(response.message);
          this.router.navigate(["/main/bank-guarantee-master"]);
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
          this.toastr.error('please upload bg document pdf only')
          this.selectedFile = null;
        }
      }else {
        this.selectedFile = inputElement.files[0];
      }
      if(!this.isAddMode){
            this.fileUpload()
          setTimeout(() => {
              this.docIdArray.push(this.docId);
          }, 3000);  
      }
    } else {
      this.selectedFile = null;
    }
  }

  onReset(): void {
    this.submitted = false;
    this.router.navigate(["/main/bank-guarantee-master"]);

    //this.addEditBankGuaranteeForm.reset();
  }

}
