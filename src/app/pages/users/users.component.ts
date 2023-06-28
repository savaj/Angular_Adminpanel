import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, first } from 'rxjs';
import { AlertService } from 'src/app/modules/shared/alert.service';
import { CommonService } from 'src/app/services/common.service';
import { GlobalConstants } from '../../common/global-constants';
import { SharedService } from 'src/app/modules/shared/shared.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  //Permission For user Insert/Edit/View/Delete
  public menu: any[] = [];
  baseUrl = "rights/resource_and_role";
  extractedData: any[] = [];
  result_data: any = { can_insert: false, can_edit: false, can_view: false, can_delete: false };

  //User Constants
  readonly USER_CONSTANT = GlobalConstants;
  //User List Configuration
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  usersData?: any[];
  //User Access Url
  resourceUrl: string = 'users';
  statusUrl: string = '/status';
  
  //Update Status For user
  isToggled: boolean = false;

  //Dependency Injection
  constructor(private commonService: CommonService, private toastr: ToastrService,
    private router: Router, private sweetAlert: AlertService,
    private shared: SharedService) {
    this.shared.getParameter().subscribe(parameter => {
      this.result_data = parameter;
    });
  }

  //User Initialization
  ngOnInit(): void {
    this.usersData = [];
    this.users();
  }

  //Get User
  users(): void {
    this.commonService.getAll(this.resourceUrl)
      .subscribe({        
        next: (response: any) => {
          //When getting Data
          this.usersData = response.data;
        },
        error: (err: any) => {
          //When getting error
          this.toastr.error(err.error.message);
        },
        complete:() => {
          //Final Without error Getting Result
        },
      });
    setTimeout(() => {
      $('.users-datatable').DataTable({
        destroy: true,
        pagingType: 'full_numbers',
        processing: true,
        lengthMenu: [5, 10, 25],
        responsive: true,
        "language": {
          "emptyTable": "No Users found"
        },
        drawCallback: function () {
          $('.dataTables_paginate').addClass('btn btn-sm btn-light');
          $('.dataTables_paginate > span a').addClass('page-link');
          $('.dataTables_paginate > span .paginate_button.current').addClass('bg-success');
          //Show Hide pagination based on Record length
          if ($(this).find('tbody tr').length <= 1 && $(this).find('tbody tr td').attr('class') === 'dataTables_empty') {
            $('.dataTables_paginate').hide();
          } else {
            $('.dataTables_paginate').show();
          }
        },
      });
    }, 500);
  }

  //Delete User
  async deleteUser(id: number, is_deleted: boolean) {
    is_deleted = !is_deleted;
    const confirmed = await this.sweetAlert.ConfirmBox()
    if (confirmed === true) {
      this.commonService.delete(this.resourceUrl, id, is_deleted).pipe(first()).subscribe({
        next: (response) => {
          //sweetalert message popup
          this.toastr.error(response.message);
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([`/main/users`]).then(() => {
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

  //Update Status For the Users
  async updateStatus(id: number, is_active: number) {
    this.isToggled = is_active === 1 ? false : true;
    this.commonService.update(`${this.resourceUrl}${this.statusUrl}`, id, { is_active: this.isToggled }).pipe(first()).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/', { skipLocationChange: false }).then(() => {
          this.router.navigate([`/main/user-master`]).then(() => {
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
