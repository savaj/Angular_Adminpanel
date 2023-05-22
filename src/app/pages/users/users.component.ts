import { Component, OnInit, ViewChild, ChangeDetectorRef  } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, first } from 'rxjs';
import { AlertService } from 'src/app/modules/shared/alert.service';
import { CommonService } from 'src/app/services/common.service';
import { GlobalConstants } from '../../common/global-constants';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  readonly USER_CONSTANT = GlobalConstants;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  usersData?: any[];
  resourceUrl: string = 'users';
  statusUrl: string = '/status';
  isToggled: boolean = false;
  constructor(private commonService: CommonService, private toastr: ToastrService,
    private router: Router, private sweetAlert: AlertService) { 
    
  }

  ngOnInit(): void {    
    this.users();
  }

  users(): void {
    this.commonService.getAll(this.resourceUrl)
      .subscribe({
        next: (response: any) => {
          this.usersData = response.data;
          setTimeout(() => {
            $('.users-datatable').DataTable({
              destroy: true,
              pagingType: 'full_numbers',
              processing: true,
              lengthMenu: [5, 10, 25],
              responsive: true,
              drawCallback: function() {
                $('.dataTables_paginate').addClass('btn btn-sm btn-light');
                $('.dataTables_paginate > span a').addClass('page-link');
                $('.dataTables_paginate > span .paginate_button.current').addClass('bg-primary');
              },
            });
          }, 500);
        },
        error: (err: any) => {
          this.toastr.error(err.error.message);
        }
      });
   }

  async deleteUser(id: number, is_deleted: boolean) {
    is_deleted = !is_deleted;
    const confirmed = await this.sweetAlert.ConfirmBox()
      if(confirmed === true){
        this.commonService.delete(this.resourceUrl, id, is_deleted).pipe(first()).subscribe({
          next: (response) => {
            //sweetalert message popup
            this.toastr.error(response.message);
            this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
              this.router.navigate([`/main/users`]).then(()=>{
              })
              })
          },
          error: (err: any) => {
            this.toastr.error(err.error.message);
          }
        });
      } else {
        this.toastr.success(this.USER_CONSTANT.user.userSafeMessage);
      }
  }

  async updateStatus(id: number, is_active: number) {
    this.isToggled = is_active === 1 ? false : true;
    this.commonService.update(`${this.resourceUrl}${this.statusUrl}`, id, { is_active: this.isToggled }).pipe(first()).subscribe({
          next: (response) => {
            this.router.navigateByUrl('/',{skipLocationChange:false}).then(()=>{
              this.router.navigate([`/main/users`]).then(()=>{
              })
              })
           this.toastr.error(response.message);
          },
          error: (err: any) => {
            this.toastr.error(err.error.message);
          }
        });
  }
}
