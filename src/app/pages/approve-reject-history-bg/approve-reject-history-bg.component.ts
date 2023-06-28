import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/common/global-constants';
import { AlertService } from 'src/app/modules/shared/alert.service';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-approve-reject-history-bg',
  templateUrl: './approve-reject-history-bg.component.html',
  styleUrls: ['./approve-reject-history-bg.component.scss']
})
export class ApproveRejectHistoryBgComponent implements OnInit {
  readonly APPROVER_CONSTANT = GlobalConstants;

  result_data: any = {can_insert: false, can_edit: false, can_view: false, can_delete: false};
  resourceUrl: string = 'bankdetails/bankApprovalDetails/hisory';
  bgApproveRejectHistoryData: any[] = [];


  constructor(private commonService: CommonService, private toastr: ToastrService,
    private router: Router, private sweetAlert: AlertService, private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private shared: SharedService) { 
      this.shared.getParameter().subscribe((data) => {
        this.result_data = data;
      });
    }

  ngOnInit(): void {
    this.bgApproveRejectHistoryData = [];
    this.bgapproverList();
  }

  
  bgapproverList(): void {
    this.spinner.show();
    this.commonService.getAll(`${this.resourceUrl}`)
      .subscribe({
        next: (response: any) => {
          this.bgApproveRejectHistoryData = response.data;
        },
        error: (err: any) => {
          this.spinner.hide();
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
            "emptyTable": "No Bg Approver found"
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

}
