import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { GlobalConstants } from 'src/app/common/global-constants';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-add-edit-admin-menu-master',
  templateUrl: './add-edit-admin-menu-master.component.html',
  styleUrls: ['./add-edit-admin-menu-master.component.scss']
})
export class AddEditAdminMenuMasterComponent implements OnInit {
  readonly ADMIN_MENU_CONSTANT = GlobalConstants;
  base_url = 'resources/menu';
  resource_url: string = 'resources';
  resourceData?: any[];

  id!: number;
  isAddMode!: boolean;
  menuTypeData = [
    {
      menutypeId: 0,
      menutypename: 'ParentMenu'
    },
    {
      menutypeId: 1,
      menutypename: 'ChildMenu'
    },
  ]
  addEditMenuForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    resource: new FormControl(''),
    menutype: new FormControl(''),
    parent: new FormControl('')
  });
  submitted = false;
  formData: any = {
    Name: '',
    resId: '',
    MenuType: '',
    ParentId: ''
  }
  showChildMenu: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private commonService: CommonService,
    private router: Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.addEditMenuForm = this.formBuilder.group(
      {
        name: ['', Validators.required],
        resource: ['', Validators.required],
        menutype: ['', Validators.required],
        parent: ['', Validators.required]
      });
      this.resources();

      this.addEditMenuForm.controls['menutype'].valueChanges.subscribe(value => {
        this.showChildMenu = value === '1' ? true : false;
        if (this.showChildMenu) {
          this.addEditMenuForm.controls['parent'].setValidators([Validators.required]);
        } else {
          this.addEditMenuForm.controls['parent'].clearValidators();
        }
        this.addEditMenuForm.controls['parent'].updateValueAndValidity();
      });

    if (!this.isAddMode) {
      this.commonService.getById(`${this.base_url}`, this.id)
        .pipe(first())
        .subscribe(x => {
          const editForm = {
            name: '',
            menutype: '',
            resource: '',
            parent: ''
          }
          editForm.menutype = x.MenuType;
          editForm.name = x.Name;
          editForm.resource = x.resId;
          editForm.parent = x.ParentId;
          this.addEditMenuForm.patchValue(editForm)
        });
    }
  }

  resources(): void {
    this.commonService.getAll(this.resource_url)
      .subscribe({
        next: (response: any) => {
          this.resourceData = response.data;
        },
        error: (err: any) => {
          this.toastr.error(err.error.message);
        }
      });
  }


  get f(): { [key: string]: AbstractControl } {
    return this.addEditMenuForm.controls;
  }

  onSubmit(): void {
    
    this.submitted = true;
    if (this.addEditMenuForm.invalid) {
      return;
    }
    this.formData.Name = this.addEditMenuForm.value.name;
    this.formData.MenuType = this.addEditMenuForm.value.menutype === "0" ? Number(this.addEditMenuForm.value.menutype) : 1;
    this.formData.resId = Number(this.addEditMenuForm.value.resource);
    this.formData.ParentId = this.formData.MenuType === 0 ?  Number(this.formData.MenuType) : this.addEditMenuForm.value.parent;
    if (this.isAddMode) {
      this.createMenu(this.formData);
    } else {
        this.updateMenu(this.formData);
    }
  }

  createMenu(formdata: any){
    try {
      const createUrl = '/create';
      this.commonService.CreateWithAuth(`${this.base_url}${createUrl}`, formdata).pipe(first()).subscribe({
        next: (response: any) => {
          this.toastr.success(response.message);
          this.router.navigate(["/main/admin-menu-master"]);
        },
        error: (err: any) => {
          this.toastr.error(err.error.message);
        }
      });
    } catch (error: any) {
      this.toastr.error(error.message);
    }
  }

  updateMenu(formdata: any){
    try {
      const updateUrl = '/update';
      this.commonService.update(`${this.base_url}${updateUrl}`,this.id, formdata).pipe(first()).subscribe({
        next: (response: any) => {
          this.toastr.success(response.message);
          this.router.navigate(["/main/admin-menu-master"]);
        },
        error: (err: any) => {
          this.toastr.error(err.error.message);
        }
      });
    } catch (error: any) {
      this.toastr.error(error.message);
    }
  }

  onReset(): void {
    this.submitted = false;
    this.addEditMenuForm.reset();
  }

}
