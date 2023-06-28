import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject, first } from 'rxjs';
import { GlobalConstants } from 'src/app/common/global-constants';
import { AlertService } from 'src/app/modules/shared/alert.service';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-vendor-master',
  templateUrl: './vendor-master.component.html',
  styleUrls: ['./vendor-master.component.scss']
})
export class VendorMasterComponent implements OnInit {
  //Permission For menu Insert/Edit/View/Delete
  result_data: any = { can_insert: false, can_edit: false, can_view: false, can_delete: false };
  //Vendor Constants
  readonly VENDOR_CONSTANT = GlobalConstants;
  //List Configuration
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  vendorsData: any[] = [];
  //Loader Config
  isLoading = false;
  //Data Access Url
  resourceUrl: string = 'vendors';
  statusUrl: string = '/status';
  //Update Status For vendor
  isToggled: boolean = false;

  //Dependency Injection
  constructor(private commonService: CommonService, private toastr: ToastrService,
    private router: Router, private sweetAlert: AlertService,
    private spinner: NgxSpinnerService,
    private shared: SharedService) {
    this.shared.getParameter().subscribe(parameter => {
      this.result_data = parameter;
    });
  }

  //Vendor Intiallization
  ngOnInit(): void {
    this.vendorsData = [];
    this.vendors();
  }

  //Get vendors
  vendors(): void {
    this.spinner.show();
    this.isLoading = true;
    this.commonService.getAll(this.resourceUrl)
      .subscribe({
        next: (response: any) => {
          this.vendorsData = response.data;
        },
        error: (err: any) => {
          this.spinner.hide();
          this.toastr.error(err.error.message);
        }
      });
    setTimeout(() => {
      $('.vendors-datatable').DataTable({
        destroy: true,
        pagingType: 'full_numbers',
        processing: true,
        lengthMenu: [5, 10, 25],
        responsive: true,
        "language": {
          "emptyTable": "No Vendors found"
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
      this.spinner.hide();
    }, 500);
  }

  //Update Status By id and is_active field
  async updateStatus(id: number, is_active: number) {
    this.isToggled = is_active === 1 ? false : true;
    this.commonService.update(`${this.resourceUrl}${this.statusUrl}`, id, { is_active: this.isToggled }).pipe(first()).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/', { skipLocationChange: false }).then(() => {
          this.router.navigate([`/main/vendor-master`]).then(() => {
          })
        })
        this.toastr.success(response.message);
      },
      error: (err: any) => {
        this.toastr.error(err.error.message);
      }
    });
  }

  //Delete vendor
  async deleteVendor(id: number, is_deleted: boolean) {
    is_deleted = !is_deleted;
    const confirmed = await this.sweetAlert.ConfirmBox()
    if (confirmed === true) {
      this.commonService.delete(this.resourceUrl, id, is_deleted).pipe(first()).subscribe({
        next: (response) => {
          //sweetalert message popup
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([`/main/vendor-master`]).then(() => {
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
}
