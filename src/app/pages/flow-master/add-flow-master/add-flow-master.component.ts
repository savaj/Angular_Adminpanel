import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-flow-master',
  templateUrl: './add-flow-master.component.html',
  styleUrls: ['./add-flow-master.component.scss']
})
export class AddFlowMasterComponent implements OnInit {
  flow_master: FormGroup = new FormGroup({
    designation: new FormControl(''),
    send_from: new FormControl(''),
    send_to: new FormControl('')
  });
  submitted = false;

  constructor(private formBuilder: FormBuilder,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.flow_master = this.formBuilder.group(
      {
        designation: ['', Validators.required],
        send_from: ['', Validators.required],
        send_to: ['', [Validators.required]],
      },
      );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.flow_master.controls;
  }

  onSubmit(): void {
    try{
      this.submitted = true;
      if (this.flow_master.invalid) {
        return;
      }
      console.log(JSON.stringify(this.flow_master.value, null, 2));
      //this.userService.postUser('/', JSON.stringify(this.form.value, null, 2));
      this.toastr.success('Flow Master Created Successfully');

    } catch(error: any){
      this.toastr.error(error.message);
    }
  }

  onReset(): void {
    this.submitted = false;
    this.flow_master.reset();
  }

}
