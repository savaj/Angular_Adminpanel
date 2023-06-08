import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { GlobalConstants } from 'src/app/common/global-constants';
import { AlertService } from 'src/app/modules/shared/alert.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-tender-master',
  templateUrl: './tender-master.component.html',
  styleUrls: ['./tender-master.component.scss']
})
export class TenderMasterComponent implements OnInit {
  readonly TENDOR_CONSTANT = GlobalConstants;
  resourceUrl: string = 'tendors';
  statusUrl: string = '/status';
  isToggled: boolean = false;
  tendorsData: any[] = [];

  constructor(private commonService: CommonService, private toastr: ToastrService,
    private router: Router, private sweetAlert: AlertService) { }

  ngOnInit(): void {
    this.tendorsData = [];
    this.tendors();
  }

  tendors(): void {
    this.commonService.getAll(this.resourceUrl)
      .subscribe({
        next: (response: any) => {
          this.tendorsData = response.data;
          setTimeout(() => {
            $('.tendors-datatable').DataTable({
              destroy: true,
              pagingType: 'full_numbers',
              processing: true,
              lengthMenu: [5, 10, 25],
              responsive: true,
              "language": {
                "emptyTable": "No Tendors found"
              },
              drawCallback: function() {
                $('.dataTables_paginate').addClass('btn btn-sm btn-light');
                $('.dataTables_paginate > span a').addClass('page-link');
                $('.dataTables_paginate > span .paginate_button.current').addClass('bg-success');
              },
            });
          }, 500);
        },
        error: (err: any) => {
          this.toastr.error(err.error.message);
        }
      });
   }

  async updateStatus(id: number, is_active: number) {
    this.isToggled = is_active === 1 ? false : true;
    this.commonService.update(`${this.resourceUrl}${this.statusUrl}`, id, { is_active: this.isToggled }).pipe(first()).subscribe({
          next: (response) => {
            this.router.navigateByUrl('/',{skipLocationChange:false}).then(()=>{
              this.router.navigate([`/main/tendor-master`]).then(()=>{
              })
              })
           this.toastr.success(response.message);
          },
          error: (err: any) => {
            this.toastr.error(err.error.message);
          }
        });
  }

  async deleteTendor(id: number, is_deleted: boolean) {
    is_deleted = !is_deleted;
    const confirmed = await this.sweetAlert.ConfirmBox()
      if(confirmed === true){
        this.commonService.delete(this.resourceUrl, id, is_deleted).pipe(first()).subscribe({
          next: (response) => {
            //sweetalert message popup
            this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
              this.router.navigate([`/main/tendor-master`]).then(()=>{
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
