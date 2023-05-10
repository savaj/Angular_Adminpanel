import { Component, OnInit } from '@angular/core';
//import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit  {
  dtOptions: DataTables.Settings = {};

  ngOnInit(): void {
    $('.dom-jQuery-events').DataTable(
      {
        lengthMenu: [5, 10, 20, 50, 100, 200, 500],
        responsive: true
      }
    );
    // this.dtOptions = {
    //   ajax: 'src/app/pages/users/data/data.json',
    //   columns: [{
    //     title: 'ID',
    //     data: 'id'
    //   }, {
    //     title: 'First name',
    //     data: 'firstName'
    //   }, {
    //     title: 'Last name',
    //     data: 'lastName'
    //   }]
    // };
  }

  users(): void {
    // this.service
    //     .getAllUsers();
    // this.dtOptions = {     
    //   ajax: 'data/data.json',
    //   columns: [{
    //     title: 'Email',
    //     data: 'email'
    //   }, {
    //     title: 'Mobile Number',
    //     data: 'mobilenumber'
    //   }, {
    //     title: 'Designation',
    //     data: 'designation'
    //   },
    //   {
    //     title: 'Department',
    //     data: 'department'
    //   },
    //   {
    //     title: 'HOD',
    //     data: 'hod'
    //   },
    //   {
    //     title: 'Branch',
    //     data: 'branch'
    //   }
    // ]
    // };
     
    }
    // console.log('this.dtOptions', this.dtOptions);

  //}


  

}
