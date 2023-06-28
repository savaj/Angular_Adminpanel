import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { GlobalConstants } from 'src/app/common/global-constants';
import { AlertService } from 'src/app/modules/shared/alert.service';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { CommonService } from 'src/app/services/common.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-tender-master',
  templateUrl: './tender-master.component.html',
  styleUrls: ['./tender-master.component.scss']
})
export class TenderMasterComponent implements OnInit {
  public menu: any[] = [];
  isLoading = false;
  baseUrl = "rights/resource_and_role";
  extractedData: any[] = [];
  result_data: any = { can_insert: false, can_edit: false, can_view: false, can_delete: false };
  readonly TENDOR_CONSTANT = GlobalConstants;
  resourceUrl: string = 'tendors';
  statusUrl: string = '/status';
  isToggled: boolean = false;
  tendorsData: any[] = [];
  constructor(private commonService: CommonService, private toastr: ToastrService,
    private router: Router, private sweetAlert: AlertService,
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private shared: SharedService) {
    this.shared.getParameter().subscribe(parameter => {
      this.result_data = parameter;
    });
  }

  ngOnInit(): void {
    this.tendorsData = [];
    this.tendors();

  }

  tendors(): void {
    this.spinner.show();
    this.isLoading = true;
    this.commonService.getAll(`${this.resourceUrl}/all/0`)
      .subscribe({
        next: (response: any) => {
          this.tendorsData = response.data;
          console.log(this.tendorsData);
        },
        error: (err: any) => {
          this.spinner.hide();
          this.toastr.error(err.error.message);
        },
      });
      setTimeout(() => {
        this.spinner.hide();
        $('.tendors-datatable').DataTable({
          pagingType: 'full_numbers',
          processing: true,
          lengthMenu: [5, 10, 25],
          responsive: true,
          "language": {
            "emptyTable": "No Tendors found"
          },
          drawCallback: function () {
            $('.dataTables_paginate').addClass('btn btn-sm btn-light');
            $('.dataTables_paginate > span a').addClass('page-link');
            $('.dataTables_paginate > span .paginate_button.current').addClass('bg-success');
            if ($(this).find('tbody tr').length <= 1 && $(this).find('tbody tr td').attr('class') === 'dataTables_empty') {
              $('.dataTables_paginate').hide();
            } else {
              $('.dataTables_paginate').show();
            }
          },
        });
      }, 500);
  }

  async updateStatus(id: number, is_active: number) {
    this.isToggled = is_active === 1 ? false : true;
    this.spinner.show();
    this.commonService.update(`${this.resourceUrl}${this.statusUrl}`, id, { is_active: this.isToggled }).pipe(first()).subscribe({
      next: (response) => {
        this.spinner.hide();
        this.router.navigateByUrl('/', { skipLocationChange: false }).then(() => {
          this.router.navigate([`/main/tender-master`]).then(() => {
          })
        })
        this.toastr.success(response.message);
      },
      error: (err: any) => {
        this.spinner.hide();
        this.toastr.error(err.error.message);
      },
    });
  }

  async deleteTendor(id: number, is_deleted: boolean) {
    is_deleted = !is_deleted;
    const confirmed = await this.sweetAlert.ConfirmBox()
    if (confirmed === true) {
      this.spinner.show();
      this.commonService.delete(this.resourceUrl, id, is_deleted).pipe(first()).subscribe({
        next: (response) => {
          this.spinner.hide();
          //sweetalert message popup
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([`/main/tender-master`]).then(() => {
            })
          })
          this.toastr.success(response.message);
        },
        error: (err: any) => {
          this.spinner.hide();
          this.toastr.error(err.error.message);
        },
      });
    }
  }


  openDocumentInNewTab(documentId: any, documentName: string, mimeType: string): void {
      this.shared.openDoc(documentId, documentName,  mimeType);
  }
}
