import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { openCloseAnimation, rotateAnimation } from './menu-item.animations';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
  animations: [openCloseAnimation, rotateAnimation]

})
export class MenuItemComponent implements OnInit {
  @Input() menuItem: any = null;
  public isExpandable: boolean = false;
  @HostBinding('class.nav-item') isNavItem: boolean = true;
  @HostBinding('class.menu-open') isMenuExtended: boolean = false;
  public isMainActive: boolean = false;
  public isOneOfChildrenActive: boolean = false;
  constructor(private router: Router, private route: ActivatedRoute) { }
  activeMenuItem: string = 'Home';

  ngOnInit(): void {
    if (
      this.menuItem &&
      this.menuItem.children &&
      this.menuItem.children.length > 0
    ) {
      this.isExpandable = true;
    }

    this.calculateIsActive(this.router.url);
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.calculateIsActive(event.url);
        return;
      });
  }

  setActiveMenuItem(menuItem: string): void {
    this.activeMenuItem = menuItem;
  }

  public handleMainMenuAction() {
    if (this.isExpandable) {
      this.toggleMenu();
      return;
    }
    this.router.navigate(this.menuItem.path);
  }

  public toggleMenu() {
    this.isMenuExtended = !this.isMenuExtended;
  }

  public calculateIsActive(url: string) {
    this.isMainActive = false;
    this.isOneOfChildrenActive = false;
    const path = `/${this.menuItem?.path[0]}`;
    if (path === url && path !== undefined) {
      this.isMainActive = true;
      return this.menuItem;
    }
  }

}
