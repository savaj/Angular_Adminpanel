import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { GlobalConstants } from 'src/app/common/global-constants';
import { AlertService } from 'src/app/modules/shared/alert.service';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-approve-reject-bg',
  templateUrl: './approve-reject-bg.component.html',
  styleUrls: ['./approve-reject-bg.component.scss']
})
export class ApproveRejectBgComponent implements OnInit {
  readonly APPROVE_REJECT_CONSTANT = GlobalConstants;
  dtOptions: DataTables.Settings = {};
  bgApproveRejectData: any[] = [];
  resourceUrl: string = 'bankdetails';
  requestListUrl: string = '/bankApprovalDetails/approval';
  approveUrl: string = '/apprej';
  isToggled: boolean = false;
  result_data: any = {can_insert: false, can_edit: false, can_view: false, can_delete: false};
  public approverListData: any;
  constructor(private commonService: CommonService, private toastr: ToastrService,
    private router: Router, private sweetAlert: AlertService, private route: ActivatedRoute,
    private shared: SharedService) {
    this.shared.getParameter().subscribe((data) => {
      this.result_data = data;
    });
   }

  ngOnInit(): void {
    this.bgApproveRejectData = [];
    this.bgRequestList();
  }

  bgRequestList(): void {
    this.commonService.getAll(`${this.resourceUrl}${this.requestListUrl}`)
      .subscribe({
        next: (response: any) => {
          this.bgApproveRejectData = response.data;
        },
        error: (err: any) => {
          this.toastr.error(err.error.message);
        }
      });
      setTimeout(() => {
        $('.bg-appRej-datatable').DataTable({
          pagingType: 'full_numbers',
          processing: true,
          lengthMenu: [5, 10, 25],
          responsive: true,
          ordering: false,
          "language": {
            "emptyTable": "No Bg Request found"
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
      }, 500);
  }

  approveReject(bank_id: number, status: string, data: any): void {
    
    this.approverListData = {
      "send_from": data.send_from,
      "send_to": data.send_to,
      "bg_status": status,
      "designation": data.designation
    };
    try {
      this.commonService.update(`${this.resourceUrl}${this.approveUrl}`, bank_id, this.approverListData).pipe(first()).subscribe({
        next: (response: any) => {
          this.router.navigateByUrl('/', { skipLocationChange: false }).then(() => {
            this.router.navigate([`/main/approve-reject-bg`]).then(() => {
            })
          })
          this.toastr.success(response.message);
        },
        error: (err: any) => {
          this.toastr.error(err.error.message);
        }
      });
    } catch (error: any) {
      this.toastr.error(error.message);
    }
  }

}
