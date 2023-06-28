import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, first } from 'rxjs';
import { GlobalConstants } from 'src/app/common/global-constants';
import { AlertService } from 'src/app/modules/shared/alert.service';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { CommonService } from 'src/app/services/common.service';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-role-master',
  templateUrl: './role-master.component.html',
  styleUrls: ['./role-master.component.scss']
})
export class RoleMasterComponent implements OnInit {
  public menu: any[] = [];
  baseUrl = "rights/resource_and_role";
  extractedData:any[] = [];
  readonly ROLE_CONSTANT = GlobalConstants;
  dtOptions: DataTables.Settings = {};
  rolesData?: any[];
  resourceUrl: string = 'roles';
  statusUrl: string = '/status';
  isToggled: boolean = false;
  result_data: any = {can_insert: false, can_edit: false, can_view: false, can_delete: false};

  constructor(private commonService: CommonService, private toastr: ToastrService,
    private router: Router, private sweetAlert: AlertService,
    private shared: SharedService) {
        this.shared.getParameter().subscribe(parameter => {
          this.result_data = parameter;
        });
     }

  ngOnInit(): void {
    this.rolesData = [];
    this.roles();
  }

  roles(): void {
    this.commonService.getAll(this.resourceUrl)
      .subscribe({
        next: (response: any) => {
          this.rolesData = response.data;
        },
        error: (err: any) => {
          this.toastr.error(err.error.message);
        }
      });
      setTimeout(() => {
        $('.roles-datatable').DataTable({
          destroy: true,
          pagingType: 'full_numbers',
          processing: true,
          lengthMenu: [5, 10, 25],
          responsive: true,
          "language": {
            "emptyTable": "No Roles found"
          },
          drawCallback: function() {
            $('.dataTables_paginate').addClass('btn btn-sm btn-light');
            $('.dataTables_paginate > span a').addClass('page-link');
            $('.dataTables_paginate > span .paginate_button.current').addClass('bg-success');
            if($(this).find('tbody tr').length <= 1 && $(this).find('tbody tr td').attr('class') === 'dataTables_empty'){
              $('.dataTables_paginate').hide();
            } else {
              $('.dataTables_paginate').show();
            }
          },
        });
      }, 500);
   }

  async deleteRole(id: number, is_deleted: boolean) {
    is_deleted = !is_deleted;
    const confirmed = await this.sweetAlert.ConfirmBox()
      if(confirmed === true){
        this.commonService.delete(this.resourceUrl, id, is_deleted).pipe(first()).subscribe({
          next: (response) => {
            //sweetalert message popup
            this.toastr.error(response.message);
            this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
              this.router.navigate([`/main/role-master`]).then(()=>{
              })
              })
          },
          error: (err: any) => {
            this.toastr.error(err.error.message);
          }
        });
      } else {
        this.toastr.success(this.ROLE_CONSTANT.role.roleSafeMessage);
      }
  }

  async updateStatus(id: number, is_active: number) {
    this.isToggled = is_active === 1 ? false : true;
    this.commonService.update(`${this.resourceUrl}${this.statusUrl}`, id, { is_active: this.isToggled }).pipe(first()).subscribe({
          next: (response) => {
            this.router.navigateByUrl('/',{skipLocationChange:false}).then(()=>{
              this.router.navigate([`/main/role-master`]).then(()=>{
              })
              })
           this.toastr.success(response.message);
          },
          error: (err: any) => {
            this.toastr.error(err.error.message);
          }
        });
  }

}
