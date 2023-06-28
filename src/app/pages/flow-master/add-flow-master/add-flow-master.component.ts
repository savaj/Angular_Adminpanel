import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-add-flow-master',
  templateUrl: './add-flow-master.component.html',
  styleUrls: ['./add-flow-master.component.scss']
})
export class AddFlowMasterComponent implements OnInit {
  base_url = 'flow-master';
  role_url = 'roles';
  id!: number;
  isAddMode!: boolean;

  flow_masterForm: FormGroup = new FormGroup({
    designation: new FormControl(''),
    send_from: new FormControl(''),
    send_to: new FormControl('')
  });
  submitted = false;
  options: any[] = [];
  //dynamicData!: { id: number; text: string; }[];
  roleData: any[] = [];
  keyword = 'name';
  formData = {
    designation: '',
    send_from: [],
    send_to: ''
  };
  submitData: any[] = [];
  previewData: any[] = [];
  finalData: any[] = [];
  previewFlag: boolean = false;
  data!: { id: number; name: string; }[];

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private commonService: CommonService, private router: Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;
    this.flow_masterForm = this.formBuilder.group(
      {
        designation: ['', Validators.required],
        send_from: ['', Validators.required],
        send_to: ['', Validators.required],
      },
    );
    this.getAllRoles();
    this.submitData = [];
    this.previewData = [];
    if (!this.isAddMode) {
      this.commonService.getById(`${this.base_url}`, this.id)
        .pipe(first())
        .subscribe(x => {
          const editData: any[] = [];
          x.forEach((item: any) => {
            item.designation = {
              id: item.designation_id,
              name: item.designation,
            };
            item.send_from = {
              id: item.send_from_id,
              name: item.send_from,
            };
            item.send_to = {
              id: item.send_to_id,
              name: item.send_to,
            };
            editData.push(item);
          })
          this.previewData = editData;
          //this.addEditMenuForm.patchValue(editForm)
        });
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.flow_masterForm.controls;
  }


  addField(): void {
    this.submitted = true;
    if (this.flow_masterForm.valid) {
      // this.flow_masterForm .clearValidators();
      // this.flow_masterForm .updateValueAndValidity();
      // this.submitted = false;
      // Form is valid, perform necessary actions
      if (this.isAddMode) {
        this.previewData.push({
          designation: this.flow_masterForm.value.designation,
          send_from: this.flow_masterForm.value.send_from,
          send_to: this.flow_masterForm.value.send_to
        });
      } else {
        //this.submitData = this.previewData;
        this.previewData.push({
          designation: this.flow_masterForm.value.designation,
          send_from: this.flow_masterForm.value.send_from,
          send_to: this.flow_masterForm.value.send_to
        });
      }
      //this.previewDatathis.submitData;
      // this.f["send_from"].reset();
      // this.f["send_to"].reset();
    } else {
      // Form is invalid, display validation errors
      this.flow_masterForm.markAllAsTouched();
    }
  }

  removeField(index: number): void {
    if (this.previewData.length < 2) {
      this.toastr.error("Minimum 1 Record is required")
    } else {
      this.previewData.splice(index, 1);
    }
  }


  preview(): void {
    this.previewData = this.flow_masterForm.value;
  }

  onSubmit(): void {
    try {
      if (this.previewData.length > 0) {
        this.previewData.forEach((item) => {
          delete item.designation_id;
          delete item.send_from_id;
          delete item.send_to_id;
          this.finalData.push({
            designation: item.designation.id,
            send_from: item.send_from.id,
            send_to: item.send_to.id
          })
        })
      }
      if (this.isAddMode) {
        this.createFlowMaster();
      } else {
        this.updateFlowMaster();
      }

    } catch (error: any) {
      this.toastr.error(error.message);
    }
  }


  getAllRoles(): void {
    this.commonService.getAll(`${this.role_url}`)
      .subscribe({
        next: (response: any) => {
          var resultData: any[] = [];
          response.data.map((item: any) => {
            resultData.push({ id: item.id, name: item.role_name });
          })
          this.data = resultData;
          this.roleData = response.data;

        },
        error: (err: any) => {
          this.toastr.error(err.error.message);
        }
      });
  }

  //Create Flow master
  private createFlowMaster() {
    try {
      this.commonService.CreateWithAuth(`${this.base_url}`, this.finalData).pipe(first()).subscribe({
        next: (response: any) => {
          this.toastr.success(response.message);
          this.router.navigate(["/main/flow-master"]);
        },
        error: (err: any) => {
          this.toastr.error(err.error.message);
        }
      });
    } catch (error: any) {
      this.toastr.error(error.message);
    }
  }

  //Update Flow Master
  private updateFlowMaster() {
    try {
      this.commonService.update(`${this.base_url}`, this.id, this.finalData).pipe(first()).subscribe({
        next: (response: any) => {
          this.toastr.success(response.message);
          this.router.navigate(["/main/flow-master"]);
        },
        error: (err: any) => {
          this.toastr.error(err.error.message);
        }
      });
    } catch (error: any) {
      this.toastr.error(error.message);
    }
  }

  //Reset Grid
  onReset(): void {
    this.submitted = false;
    this.previewData = [];
    this.finalData = [];
    this.flow_masterForm.reset();
  }

  //Swap Rank For Grid before submit
  swapRank(length: number, index1: any, index2: number, direction: string): void {
    if (index2 === -1) {
      this.toastr.error("This one rank is already on top");
    } else if (index2 === length) {
      this.toastr.error("This one rank is already on down");
    } else {
      [this.previewData[index1], this.previewData[index2]] = [this.previewData[index2], this.previewData[index1]];
    }
  }
}
