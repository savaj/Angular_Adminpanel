import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-flow-master',
  templateUrl: './flow-master.component.html',
  styleUrls: ['./flow-master.component.scss']
})
export class FlowMasterComponent implements OnInit {
  dtOptions: DataTables.Settings = {};

  constructor() { }

  ngOnInit(): void {
    $('.dom-jQuery-events1').DataTable(
      {
        lengthMenu: [5, 10, 20, 50, 100, 200, 500],
        responsive: true
      }
    );
  }

}
