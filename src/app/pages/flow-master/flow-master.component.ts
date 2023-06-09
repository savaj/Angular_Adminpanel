import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { GlobalConstants } from 'src/app/common/global-constants';
import { AlertService } from 'src/app/modules/shared/alert.service';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-flow-master',
  templateUrl: './flow-master.component.html',
  styleUrls: ['./flow-master.component.scss']
})
export class FlowMasterComponent implements OnInit {
  public menu: any[] = [];
  baseUrl = "rights/resource_and_role";
  extractedData:any[] = [];
  result_data: any = {can_insert: false, can_edit: false, can_view: false, can_delete: false};
  readonly FLOW_CONSTANT = GlobalConstants;
  dtOptions: DataTables.Settings = {};
  flowMasterData: any[] = [];
  flowMasterBaseUrl = "flow-master";
  statusUrl: string = '/status';
  isToggled: boolean = false;

  constructor(private commonService: CommonService, private toastr: ToastrService,
    private router: Router, private sweetAlert: AlertService,
    private shared: SharedService) {
      this.shared.getParameter().subscribe(parameter => {
        this.result_data = parameter;
      });
     }

  ngOnInit(): void {
    this.flowMasterData = [];
    this.flowMaster();
  }

  flowMaster(): void {
    this.commonService.getAll(`${this.flowMasterBaseUrl}`)
      .subscribe({
        next: (response: any) => {
          this.flowMasterData = response.data;
        },
        error: (err: any) => {
          this.toastr.error(err.error.message);
        }
      });
      setTimeout(() => {
        $('.flow-master-datatable').DataTable({
          pagingType: 'full_numbers',
          processing: true,
          lengthMenu: [5, 10, 25],
          responsive: true,
          ordering: false,
          "language": {
            "emptyTable": "No Flows found"
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


  async deleteFlow(id: number, is_deleted: boolean) {
    is_deleted = !is_deleted;
    const confirmed = await this.sweetAlert.ConfirmBox()
    if (confirmed === true) {
      this.commonService.delete(this.flowMasterBaseUrl, id, is_deleted).pipe(first()).subscribe({
        next: (response) => {
          //sweetalert message popup
          this.toastr.error(response.message);
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([`/main/flow-master`]).then(() => {
            })
          })
        },
        error: (err: any) => {
          this.toastr.error(err.error.message);
        }
      });
    } else {
      this.toastr.success(this.FLOW_CONSTANT.flow.flowSafeMessage);
    }
  }

  async updateStatus(id: number, is_active: number) {
    this.isToggled = is_active === 1 ? false : true;
    this.commonService.update(`${this.flowMasterBaseUrl}${this.statusUrl}`, id, { is_active: this.isToggled }).pipe(first()).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/', { skipLocationChange: false }).then(() => {
          this.router.navigate([`/main/flow-master`]).then(() => {
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
