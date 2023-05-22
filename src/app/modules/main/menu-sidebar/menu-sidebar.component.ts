import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-menu-sidebar',
  templateUrl: './menu-sidebar.component.html',
  styleUrls: ['./menu-sidebar.component.scss']
})
export class MenuSidebarComponent implements OnInit {
  public menu = MENU;
  constructor() { }

  ngOnInit(): void {
  }

}

export const MENU = [
  {
      name: 'Dashboard',
      iconClasses: '/main/dashboard',
      path: ['/main/dashboard'],
      children: [
        {
            name: 'Dashboard',
            iconClasses: '',
            path: ['/main/dashboard']
        },
        {
            name: 'User Master',
            iconClasses: '',
            path: ['/main/users']
        },
        {
          name: 'Role Master',
          iconClasses: '',
          path: ['/main/role-master']
        },
        {
          name: 'Resource Master',
          iconClasses: '',
          path: ['/main/resource-master']
        },
        {
          name: 'Right Master',
          iconClasses: '',
          path: ['/main/right-master']
        },
        {
          name: 'Menu Master',
          iconClasses: '',
          path: ['/main/admin-menu-master']
        },
    ]
  },
];

