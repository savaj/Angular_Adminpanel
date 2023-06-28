import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { LocalService } from 'src/app/services/local.service';


@Component({
  selector: 'app-menu-sidebar',
  templateUrl: './menu-sidebar.component.html',
  styleUrls: ['./menu-sidebar.component.scss']
})
export class MenuSidebarComponent implements OnInit {
  public menu: any[] = [];
  baseUrl = "rights/resource_and_role";
  extractedData:any[] = [];
  constructor(private commonService: CommonService,
    private toastr: ToastrService,private router: Router, private route: ActivatedRoute,
    private localStore: LocalService) {
     }

  ngOnInit(): void {
    const extractedTokenData = this.commonService.extractDataFromToken();
    if(extractedTokenData){
      this.commonService.getAll(`${this.baseUrl}/${extractedTokenData?.roleId}`)
      .subscribe({
        next: (response: any) => {
          const resultArray: any[] = response.data;
          const result = resultArray.map(({MenuResourceId,MenuType,ParentId,ParentName,
            menu_id,resource_name,role_id,updatedBy,...rest}) => ({...rest}));
            this.router.events.subscribe((url:any) => url);
            result.map((val: any) => {
              val.data = {
                can_insert: val.can_insert,
                can_view: val.can_view,
                can_edit: val.can_edit,
                can_delete: val.can_delete,
              }
              if(this.router.url === `/${val.resource_url}`){
                  this.localStore.saveData('data', JSON.stringify(val.data));
              }
              val.name = val.Name;
              val.iconClasses = '';
              val.path = [val.resource_url];
              delete val.resource_url;
              delete val.Name;
            })
            const filteredarray = result.filter(d=> d.can_view === true);
            this.extractedData = filteredarray;
            this.menu = this.extractedData;
        },
        error: (err: any) => {
          this.toastr.error(err.error.message);
        }
      });
    }
    
  }
}


// export const MENU = [
//   {
//       name: 'Dashboard',
//       iconClasses: '/main/dashboard',
//       path: ['/main/dashboard'],
//       children: [
//         {
//             name: 'Dashboard',
//             iconClasses: '',
//             path: ['/main/dashboard']
//         },
//         {
//             name: 'User Master',
//             iconClasses: '',
//             path: ['/main/users']
//         },
//         {
//           name: 'Role Master',
//           iconClasses: '',
//           path: ['/main/role-master']
//         },
//         {
//           name: 'Resource Master',
//           iconClasses: '',
//           path: ['/main/resource-master']
//         },
//         {
//           name: 'Right Master',
//           iconClasses: '',
//           path: ['/main/right-master']
//         },
//         {
//           name: 'Menu Master',
//           iconClasses: '',
//           path: ['/main/admin-menu-master']
//         },
//         {
//           name: 'Vendor Master',
//           iconClasses: '',
//           path: ['/main/vendor-master']
//         },
//         {
//           name: 'Tender Master',
//           iconClasses: '',
//           path: ['/main/tender-master']
//         },
//         {
//           name: 'Flow Master',
//           iconClasses: '',
//           path: ['/main/flow-master']
//         },
//         {
//           name: 'Bank Guarantee Master',
//           iconClasses: '',
//           path: ['/main/bank-guarantee-master']
//         }        
//     ]
//   },
// ];

