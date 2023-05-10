import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private localStore: LocalService, private router: Router) { }

  ngOnInit(): void {
  }

  logout(): void {
    this.localStore.clearData();
    this.router.navigate(["/login"]);
  }
}
