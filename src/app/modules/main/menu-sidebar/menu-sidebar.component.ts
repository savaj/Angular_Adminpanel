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
      iconClasses: '',
      children: [
        {
            name: 'Dashboard',
            iconClasses: '',
            path: ['/']
        },
        {
            name: 'User Master',
            iconClasses: '',
            path: ['/users']
        },
        {
          name: 'Flow Master',
          iconClasses: '',
          path: ['/flow-master']
      },
    ]
  },
];

