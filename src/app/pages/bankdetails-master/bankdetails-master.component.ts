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
  selector: 'app-bankdetails-master',
  templateUrl: './bankdetails-master.component.html',
  styleUrls: ['./bankdetails-master.component.scss']
})
export class BankdetailsMasterComponent implements OnInit {
  readonly BANK_CONSTANT = GlobalConstants;
  bankGuaranteeBaseUrl = "bankdetails";
  bankGuaranteeData: any[] = [];
  isToggled: boolean = false;
  statusUrl: string = '/status';
  isLoading = false;
  result_data: any = {can_insert: false, can_edit: false, can_view: false, can_delete: false};

  constructor(private commonService: CommonService, private toastr: ToastrService,
    private router: Router, private sweetAlert: AlertService,
    private spinner: NgxSpinnerService,
    private shared: SharedService) { 
      this.shared.getParameter().subscribe(parameter => {
        this.result_data = parameter;
      });
    }

  ngOnInit(): void {
    
    this.bankGuaranteeData = [];
    this.bankGuarantee();
  }


  bankGuarantee(): void {
    this.spinner.show();
    this.isLoading = true;
    this.commonService.getAll(`${this.bankGuaranteeBaseUrl}`)
      .subscribe({
        next: (response: any) => {
          this.bankGuaranteeData = response.data;
        },
        error: (err: any) => {
          this.spinner.hide();
          this.toastr.error(err.error.message);
        }
      });
        setTimeout(() => {
          $('.bankguarantee-datatable').DataTable({
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

  async deleteBank(id: number, is_deleted: boolean) {
    is_deleted = !is_deleted;
    const confirmed = await this.sweetAlert.ConfirmBox()
    if (confirmed === true) {
      this.commonService.delete(this.bankGuaranteeBaseUrl, id, is_deleted).pipe(first()).subscribe({
        next: (response) => {
          //sweetalert message popup
          this.toastr.error(response.message);
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([`/main/bank-guarantee-master`]).then(() => {
            })
          })
        },
        error: (err: any) => {
          this.toastr.error(err.error.message);
        }
      });
    } else {
      this.toastr.success(this.BANK_CONSTANT.bank.bankSafeMessage);
    }
  }

  async updateStatus(id: number, is_active: number) {
    this.isToggled = is_active === 1 ? false : true;
    this.commonService.update(`${this.bankGuaranteeBaseUrl}${this.statusUrl}`, id, { is_active: this.isToggled }).pipe(first()).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/', { skipLocationChange: false }).then(() => {
          this.router.navigate([`/main/bank-guarantee-master`]).then(() => {
          })
        })
        this.toastr.success(response.message);
      },
      error: (err: any) => {
        this.toastr.error(err.error.message);
      }
    });
  }

  openDocumentInNewTab(documentId: any, documentName: string, mimeType: string): void {
    this.shared.openDoc(documentId, documentName,  mimeType);
  }

}
