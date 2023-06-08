import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { GlobalConstants } from 'src/app/common/global-constants';
import { AlertService } from 'src/app/modules/shared/alert.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-right-master',
  templateUrl: './right-master.component.html',
  styleUrls: ['./right-master.component.scss']
})
export class RightMasterComponent implements OnInit {
  readonly RIGHT_CONSTANT = GlobalConstants;
  rightsData: any[] = [];
  updatedrightsData: any[] = [];
  menuData: any[] = [];
  resourceUrl: string = 'rights/resource_and_role';
  rightsUrl: string = 'rights';
  menuUrl: string = 'resources/menu';
  rolesUrl: string = 'roles';
  resourceResUrl: string = 'resources';
  adminMenuWithResourceAllUrl: string = 'menu/adminMenuWithResourceAll';
  selectAllInsert: boolean | undefined = false;
  selectAllEdit: boolean | undefined = false;
  selectAllView: boolean | undefined = false;
  selectAllDelete: boolean | undefined = false;

  selectInsert: boolean | undefined = false;
  selectEdit: boolean | undefined = false;
  selectView: boolean | undefined = false;
  selectDelete: boolean | undefined = false;

  roleData: any[] = [];
  searchForm: FormGroup = new FormGroup({
    role: new FormControl(''),
    menu: new FormControl('')
  });
  selectRoleId: any;
  selectMenuId: any;
  rightsMenuData: any[] = [];
  roleId: number | undefined;
  constructor(private commonService: CommonService, private toastr: ToastrService,
    private router: Router, private sweetAlert: AlertService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group(
      {
        role: [''],
        menu: [''],
      });
    this.rightsData = [];
    this.rights();
    this.roles();
    this.menus();
  }

  rights(roleId?: number, menuId?: number): void {
    this.roleId = roleId;
    console.log(this.roleId);
    this.commonService.getByData(this.resourceUrl, { roleId: roleId ?? '', menuId: menuId ?? '' })
      .subscribe({
        next: (response: any) => {
          const rightResultData = response.data;
            this.commonService.getAll(`${this.resourceResUrl}/${this.adminMenuWithResourceAllUrl}`)
            .subscribe({
                next: (response: any) => {
                  this.rightsMenuData = response.data;
                  if(rightResultData.length === 0 && roleId){
                    this.rightsMenuData.forEach(val => {
                      val.can_insert = false;
                      val.can_edit = false;
                      val.can_view = false;
                      val.can_delete = false;
                      val.role_id = this.roleId;
                    })
                    this.rightsData = this.rightsMenuData;
                  }
                  if(rightResultData.length > 0 && rightResultData.filter((e:any) => e.role_id === this.roleId) && roleId){
                    this.rightsData = rightResultData;
                  }
                  if(roleId){
                     this.selectAllInsert = this.rightsData?.every((val:any) => val.can_insert === true ? true : false);
                    this.selectAllEdit = this.rightsData?.every((val:any) => val.can_edit === true ? true : false);
                    this.selectAllView = this.rightsData?.every((val:any) => val.can_view === true ? true : false);
                    this.selectAllDelete = this.rightsData?.every((val:any) => val.can_delete === true ? true : false);
                  }
                 
                },error: (err: any) => {
                  this.toastr.error(err.error.message);
                } 
            });
            
            var table: any;
            if ( $.fn.dataTable.isDataTable( '.rights-datatable' ) ) {
              table = $('.rights-datatable').DataTable();
          }
          else {
              table = $('.rights-datatable').DataTable( {
                processing: true,
                paging: false,
                searching: false,
                responsive: true,
                ordering: false
              } );
          }
          
          
          
              
              // console.log(this.rightsData);
                // if(this.rightsData.length > 0){
                //   this.selectAllInsert = this.rightsData?.every(val => val.can_insert === (null || false) ? false : true);
                //   this.selectAllEdit = this.rightsData?.every(val => val.can_edit === (null || false) ? false : true);
                //   this.selectAllView = this.rightsData?.every(val => val.can_view === (null || false) ? false : true);
                //   this.selectAllDelete = this.rightsData?.every(val => val.can_delete === (null || false) ? false : true);
                // }
              
            // if(this.rightsMenuData.length === this.rightsData.length){
            //   if(this.rightsData.length > 0){
            //     // this.selectRoleId = this.rightsData.role_id;
            //     // this.selectMenuId = this.rightsData.menu_id;
            //     this.selectAllInsert = this.rightsData?.every(val => val.can_insert === true ? true : false);
            //     this.selectAllEdit = this.rightsData?.every(val => val.can_edit === true ? true : false);
            //     this.selectAllView = this.rightsData?.every(val => val.can_view === true ? true : false);
            //     this.selectAllDelete = this.rightsData?.every(val => val.can_delete === true ? true : false);
            //   }
            // } else {
            //     this.rightsData = this.rightsMenuData;
            //     console.log(this.rightsData);
            //     this.selectAllInsert = this.rightsData?.every(val => val.can_insert === (null || false) ? false : true);
            //     this.selectAllEdit = this.rightsData?.every(val => val.can_edit === (null || false) ? false : true);
            //     this.selectAllView = this.rightsData?.every(val => val.can_view === (null || false) ? false : true);
            //     this.selectAllDelete = this.rightsData?.every(val => val.can_delete === (null || false) ? false : true);
            // }
          
          //setTimeout(() => {
               
         // }, 500);
        },
        error: (err: any) => {
          this.toastr.error(err.error.message);
        }
      });
  }



  menus(): void {
    const listUrl = "/list";
    this.commonService.getAll(`${this.menuUrl}${listUrl}`)
      .subscribe({
        next: (response: any) => {
          this.menuData = response.data;
        },
        error: (err: any) => {
          this.toastr.error(err.error.message);
        }
      });
  }

  search(): void{
    const roleId = Number(this.searchForm.value.role);
    const menuId = Number(this.searchForm.value.menu);
    this.rights(roleId, menuId);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.searchForm.controls;
  }

  roles(): void {
    this.commonService.getAll(this.rolesUrl)
      .subscribe({
        next: (response: any) => {
          this.roleData = response.data;
        },
        error: (err: any) => {
          this.toastr.error(err.error.message);
        }
      });
  }

  saveMenu(): void {
    try {
      this.rightsData.map((rightres) => {
        rightres.role_id = this.roleId;
        return rightres;
      });
      this.commonService.bulkupdate(`${this.rightsUrl}`, {"data": this.rightsData}).pipe(first()).subscribe({
        next: (response: any) => {
          this.toastr.success(response.message);
          this.router.navigate(["/main/right-master"]);
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

  toggleCheckboxInsert(data: any): void {
    data.can_insert = !data.can_insert;
    this.selectAllInsert = this.rightsData?.every(val => val.can_insert === true ? true : false);
    //this.updatedrightsData = this.rightsData.filter((item) => item.id === data.id);
  }

  toggleCheckboxEdit(data: any): void {
    data.can_edit = !data.can_edit;
    this.selectAllEdit = this.rightsData?.every(val => val.can_edit === true ? true : false);
    //this.updatedrightsData = this.rightsData.filter((item) => item.id === data.id);
  }

  toggleCheckboxView(data: any): void {
    data.can_view = !data.can_view;
    this.selectAllView = this.rightsData?.every(val => val.can_view === true ? true : false);
    //this.updatedrightsData = this.rightsData.filter((item) => item.id === data.id);
  }

  toggleCheckboxDelete(data: any): void {
    data.can_delete = !data.can_delete;
    this.selectAllDelete = this.rightsData?.every(val => val.can_delete === true ? true : false);
    //this.updatedrightsData = this.rightsData.filter((item) => item.id === data.id);
  }

  toggleSelectAllInsert(): void {
    this.selectAllInsert = !this.selectAllInsert;
    this.rightsData?.forEach(item => item.can_insert = this.selectAllInsert);
  }

  toggleSelectAllEdit(): void {
    this.selectAllEdit = !this.selectAllEdit;
    this.rightsData?.forEach(item => item.can_edit = this.selectAllEdit);
  }

  toggleSelectAllView(): void {
    this.selectAllView = !this.selectAllView;
    this.rightsData?.forEach(item => item.can_view = this.selectAllView);
  }

  toggleSelectAllDelete(): void {
    this.selectAllDelete = !this.selectAllDelete;
    this.rightsData?.forEach(item => item.can_delete = this.selectAllDelete);
  }
}
