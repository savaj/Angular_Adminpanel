import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { GlobalConstants } from 'src/app/common/global-constants';
import { AlertService } from 'src/app/modules/shared/alert.service';
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
  constructor(private commonService: CommonService, private toastr: ToastrService,
    private router: Router, private sweetAlert: AlertService) { }

  ngOnInit(): void {
    this.menus();
  }

  menus(): void {
    const listUrl = "/list";
    this.commonService.getAll(`${this.resourceUrl}${listUrl}`)
      .subscribe({
        next: (response: any) => {
          this.menuData = response.data;
          setTimeout(() => {
            $('.menu-datatable').DataTable({
              pagingType: 'full_numbers',
              processing: true,
              lengthMenu: [5, 10, 25],
              responsive: true,
              ordering: false,
              drawCallback: function () {
                $('.dataTables_paginate').addClass('btn btn-sm btn-light');
                $('.dataTables_paginate > span a').addClass('page-link');
                $('.dataTables_paginate > span .paginate_button.current').addClass('bg-success');
              }
            });
          }, 500);
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
        console.log(err);

        this.toastr.error(err.error.message);
      },
      complete: () => {
        console.log('completed');
      }
    });
  }

  swapRank(length: number, index1: any, index2: number, direction: string): void {
    //console.log(item);
    // console.log(direction === 1 ? 'up' : 'down');
    // const currentIndex = this.menuData?.findIndex((i: any) => i === item);
    // const newIndex = currentIndex + direction;
    // if (newIndex >= 0 && newIndex < this.menuData.length) {
    //   const temp = this.menuData[currentIndex].MenuRank;
    //   this.menuData[currentIndex].MenuRank = this.menuData[newIndex].MenuRank;
    //   this.menuData[newIndex].MenuRank = temp;
    // }
    if (index2 === -1 && direction === 'up') {
      this.toastr.error("Rank is already on top")
    } else if (index2 === length && direction === 'down') {
      this.toastr.error("This Rank is last please try different one")
    } else {
      [this.menuData[index1], this.menuData[index2]] = [this.menuData[index2], this.menuData[index1]];
      // if(direction === 'up'){
      //   const menuResult: any[] = [];
      // this.menuData.forEach((item) => {
      //   if(item.MenuRank === 0){
      //     item.MenuRank = 1;
      //   } else {
      //     item.MenuRank = item.MenuRank - 1;
      //   }
      //   menuResult.push({ menuId: item.id, menuRank: item.MenuRank });
      // })
      // console.log(menuResult);
      // } else {
      //   const menuResult: any[] = [];
      //   this.menuData.forEach((item) => {
      //     if(item.MenuRank === 0){
      //       item.MenuRank = 1;
      //     } else {
      //       item.MenuRank = item.MenuRank - 1;
      //     }
      //     menuResult.push({ menuId: item.id, menuRank: item.MenuRank });
      //   })
      // }

      
      
      // const rankUrl = '/rank'
      // this.commonService.updateWithoutId(`${this.resourceUrl}${rankUrl}`, {
      //   "data": menuResult }).pipe(first()).subscribe({
      //   next: (response) => {
      //     this.toastr.success(response.message);
      //     this.router.navigateByUrl('/', { skipLocationChange: false }).then(() => {
      //       this.router.navigate([`/main/admin-menu-master`]).then(() => {
      //       })
      //     })
      //     //this.menus();
      //   },
      //   error: (err: any) => {
      //     console.log(err);

      //     this.toastr.error(err.error.message);
      //   },
      //   complete: () => {
      //     console.log('completed');
      //   }
      // });
    }
  }

}
