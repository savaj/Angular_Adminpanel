import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { GlobalConstants } from 'src/app/common/global-constants';
import { AlertService } from 'src/app/modules/shared/alert.service';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-admin-menu-master',
  templateUrl: './admin-menu-master.component.html',
  styleUrls: ['./admin-menu-master.component.scss']
})
export class AdminMenuMasterComponent implements OnInit {
  readonly MENU_CONSTANT = GlobalConstants;
  dtOptions: DataTables.Settings = {};
  menuData: any[] = [];
  resourceUrl: string = 'resources/menu';
  statusUrl: string = '/status';
  isToggled: boolean = false;
  result_data: any = { can_insert: false, can_edit: false, can_view: false, can_delete: false };
  public data: any;
  constructor(private commonService: CommonService, private toastr: ToastrService,
    private router: Router, private sweetAlert: AlertService, private route: ActivatedRoute,
    private shared: SharedService) {
    this.shared.getParameter().subscribe(parameter => {
      this.result_data = parameter;
    });
  }

  ngOnInit(): void {
    this.menuData = [];
    this.menus();
  }

  menus(): void {
    const listUrl = "/list";
    this.commonService.getAll(`${this.resourceUrl}${listUrl}`)
      .subscribe({
        next: (response: any) => {
          this.menuData = response.data;
        },
        error: (err: any) => {
          this.toastr.error(err.error.message);
        }
      });
    setTimeout(() => {
      $('.menu-datatable').DataTable({
        pagingType: 'full_numbers',
        processing: true,
        lengthMenu: [5, 10, 25],
        responsive: true,
        ordering: false,
        "language": {
          "emptyTable": "No Admin Menu found"
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
        }
      });
    }, 500);

  }

  async rankUpdateResult() {
    const listUrl = "/list";
    this.commonService.getAll(`${this.resourceUrl}${listUrl}`)
      .subscribe({
        next: (response: any) => {
          this.menuData = response.data;
        },
        error: (err: any) => {
          this.toastr.error(err.error.message);
        }
      });
  }

  async deleteMenu(id: number, is_deleted: boolean) {
    is_deleted = !is_deleted;
    const confirmed = await this.sweetAlert.ConfirmBox()
    if (confirmed === true) {
      this.commonService.delete(this.resourceUrl, id, is_deleted).pipe(first()).subscribe({
        next: (response) => {
          //sweetalert message popup
          this.toastr.error(response.message);
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([`/main/admin-menu-master`]).then(() => {
            })
          })
        },
        error: (err: any) => {
          this.toastr.error(err.error.message);
        }
      });
    } else {
      this.toastr.success(this.MENU_CONSTANT.menu.menuSafeMessage);
    }
  }

  async updateStatus(id: number, is_active: number) {
    this.isToggled = is_active === 1 ? false : true;
    this.commonService.update(`${this.resourceUrl}${this.statusUrl}`, id, { is_active: this.isToggled }).pipe(first()).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/', { skipLocationChange: false }).then(() => {
          this.router.navigate([`/main/admin-menu-master`]).then(() => {
          })
        })
        this.toastr.success(response.message);
      },
      error: (err: any) => {
        this.toastr.error(err.error.message);
      }
    });
  }


  swapRank(length: number, index1: number, index2: number, dir: string, rank: number): void {
    const firstRank = this.menuData.find((menRes) => menRes.MenuRank === rank).MenuRank;

    const minValue = this.menuData.reduce((min, current) => {
      return current.MenuRank < min ? current.MenuRank : min;
    }, Number.MAX_VALUE);

    const maxValue = this.menuData.reduce((max, current) => {
      return current.value > max ? current.value : max;
    }, Number.MIN_VALUE);

    if (dir == "up" && (rank - 1) < minValue) {
      this.toastr.error("This Menu already have min rank!");
    }
    else if (dir == "down" && (rank + 1) > maxValue) {
      this.toastr.error("This Menu already have max rank!");
    }
    else {
      this.menuData.forEach((val, index, arr) => {
        if (dir == "up" && val['MenuRank'] == rank) {
          if (rank > 1) {
            const previousMenu = this.menuData.find((m) => m.MenuRank === rank - 1);
            previousMenu.MenuRank += 1;
            val['MenuRank'] -= 1;
          }
        }
        else if (dir == "down" && val['MenuRank'] == rank) {
          if (rank < length) {
            const nextMenu = this.menuData.find((m) => m.MenuRank === rank + 1);
            nextMenu.MenuRank -= 1;
            val['MenuRank'] += 1;
          }
        }
      })
      this.commonService.updateWithoutId(`${this.resourceUrl}/rank`, { data: this.menuData }).pipe(first()).subscribe({
        next: (response) => {
          this.router.navigateByUrl('/', { skipLocationChange: false }).then(() => {
            this.router.navigate([`/main/admin-menu-master`]).then(() => {
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
