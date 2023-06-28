import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { GlobalConstants } from 'src/app/common/global-constants';
import { AlertService } from 'src/app/modules/shared/alert.service';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-bg-return',
  templateUrl: './bg-return.component.html',
  styleUrls: ['./bg-return.component.scss']
})
export class BgReturnComponent implements OnInit {
  readonly BG_CONSTANT = GlobalConstants;
  result_data: any = {can_insert: false, can_edit: false, can_view: false, can_delete: false};
  bgReturnData: any[] = [];
  isLoading = false;
  bgReturnBaseUrl = "bankdetailsReturn";
  isToggled: boolean = false;
  statusUrl: string = '/status';

  constructor(private commonService: CommonService, private toastr: ToastrService,
    private router: Router, private sweetAlert: AlertService,
    private spinner: NgxSpinnerService,
    private shared: SharedService) { 
      this.shared.getParameter().subscribe(parameter => {
        this.result_data = parameter;
      });
    }

  ngOnInit(): void {
    this.bgReturnData = [];
    this.bgReturn();
  }

  bgReturn(): void {
    this.spinner.show();
    this.isLoading = true;
    this.commonService.getAll(`${this.bgReturnBaseUrl}`)
      .subscribe({
        next: (response: any) => {
          this.bgReturnData = response.data;
        },
        error: (err: any) => {
          this.spinner.hide();
          this.toastr.error(err.error.message);
        }
      });
        setTimeout(() => {
          $('.bg-return-datatable').DataTable({
            pagingType: 'full_numbers',
            processing: true,
            lengthMenu: [5, 10, 25],
            responsive: true,
            ordering: false,
            "language": {
              "emptyTable": "No BankDetails found"
            },
            drawCallback: function () {
              $('.dataTables_paginate').addClass('btn btn-sm btn-light');
              $('.dataTables_paginate > span a').addClass('page-link');
              $('.dataTables_paginate > span .paginate_button.current').addClass('bg-success');
              if($(this).find('tbody tr').length <= 1 && $(this).find('tbody tr td').attr('class') === 'dataTables_empty'){
                $('.dataTables_paginate').hide();
              } else {
                $('.dataTables_paginate').show();
              }
            }
          });
          this.spinner.hide();
       }, 500);
  }

  async updateStatus(id: number, is_active: number) {
    this.isToggled = is_active === 1 ? false : true;
    this.commonService.update(`${this.bgReturnBaseUrl}${this.statusUrl}`, id, { is_active: this.isToggled }).pipe(first()).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/', { skipLocationChange: false }).then(() => {
          this.router.navigate([`/main/bg-return`]).then(() => {
          })
        })
        this.toastr.success(response.message);
      },
      error: (err: any) => {
        this.toastr.error(err.error.message);
      }
    });
  }

  async deleteBgReturn(id: number, is_deleted: boolean) {
    is_deleted = !is_deleted;
    const confirmed = await this.sweetAlert.ConfirmBox()
    if (confirmed === true) {
      this.commonService.delete(this.bgReturnBaseUrl, id, is_deleted).pipe(first()).subscribe({
        next: (response) => {
          //sweetalert message popup
          this.toastr.error(response.message);
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([`/main/bg-return`]).then(() => {
            })
          })
        },
        error: (err: any) => {
          this.toastr.error(err.error.message);
        }
      });
    } else {
      this.toastr.success(this.BG_CONSTANT.bgReturn.bgReturnsSafeMessage);
    }
  }

}
