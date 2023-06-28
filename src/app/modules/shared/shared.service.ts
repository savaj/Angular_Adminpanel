import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { LocalService } from 'src/app/services/local.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public menu: any[] = [];
  baseUrl = "rights/resource_and_role";
  extractedData: any[] = [];
  sharedData: any = { can_insert: false, can_edit: false, can_view: false, can_delete: false };
  private parameterSubject = new Subject<any>();

  constructor(private commonService: CommonService,
    private toastr: ToastrService, private router: Router, private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private localStore: LocalService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.localStorageData();
      }
    });
  }

  localStorageData() {
    const extractedTokenData = this.commonService.extractDataFromToken();
    if (extractedTokenData) {
      this.commonService.getAll(`${this.baseUrl}/${extractedTokenData?.roleId}`)
        .subscribe({
          next: (response: any) => {
            const resultArray: any[] = response.data;
            const result = resultArray.map(({ MenuResourceId, MenuType, ParentId, ParentName,
              menu_id, resource_name, role_id, updatedBy, ...rest }) => ({ ...rest }));
            this.router.events.subscribe((url: any) => url);
            result.map((val: any) => {
              val.data = {
                can_insert: val.can_insert,
                can_view: val.can_view,
                can_edit: val.can_edit,
                can_delete: val.can_delete,
              }
              if (this.router.url === `/${val.resource_url}`) {
                this.localStore.saveData('data', JSON.stringify(val.data));
                this.sharedData = JSON.parse(this.localStore.getData('data'));
                this.parameterSubject.next(this.sharedData);
              }
              val.name = val.Name;
              val.iconClasses = '';
              val.path = [val.resource_url];
              delete val.resource_url;
              delete val.Name;
            })
            const filteredarray = result.filter(d => d.can_view === true);
            this.extractedData = filteredarray;
            this.menu = this.extractedData;
          },
          error: (err: any) => {
            this.toastr.error(err.error.message);
          }
        });
    }

  }

  getParameter() {
    return this.parameterSubject.asObservable();
  }

  base64ToBlob(base64: string, type = "application/octet-stream") {
    const binStr = atob(base64);
    const len = binStr.length;
    const arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      arr[i] = binStr.charCodeAt(i);
    }
    return new Blob([arr], { type: type });
  }


  openDoc(documentId: any, documentName: string, mimeType: string) {
    const documentUrl = `common/getDocument/${documentId}`
    const postData = {
      "docName": documentName,
      "mimeType": mimeType
    }
    this.spinner.show();
    this.commonService.postDocument(documentUrl, postData).subscribe({
      next: (response: any) => {
        const data = response.data;
        const blob = this.base64ToBlob(data, mimeType);
        const url = URL.createObjectURL(blob);
        var newTab: any = window.open();
        this.spinner.hide();
        // Create the HTML content for the new tab
        var htmlContent = `
        <html>
          <head>
          <title>Document</title>
          </head>
          <body>
          <iframe src="${url}" width="100%" height="100%"></iframe>
          </body>
        </html>
        `;

        // Set the content of the new tab
        newTab.document.open();
        newTab.document.write(htmlContent);
        newTab.document.close();
      },
      error: (err: any) => {
        this.spinner.hide();
        this.toastr.error(err.error.message);
      },
    });
  }

  convertDate(date: Date): number {
    const formattedDate: any = this.datePipe.transform(date, 'yyyy-MM-dd'); // Adjust the format as per your requirements
    const convertedDate = new Date(formattedDate).getTime();
    return convertedDate;
  }

  compareDates(date1: Date, date2: Date): number {
    const convertedDate1 = this.convertDate(date1);
    const convertedDate2 = this.convertDate(date2);
    const res1: any = (convertedDate1 > convertedDate2);
    const res2: any = (convertedDate1 < convertedDate2);
    return (res1 - res2) || NaN;
  }

  isDateInBetween(startDate: Date, endDate: Date, checkDate: Date): boolean {
    const convertedStartDate = this.convertDate(startDate);
    const convertedEndDate = this.convertDate(endDate);
    const convertedCheckDate = this.convertDate(checkDate);
    return convertedCheckDate >= convertedStartDate && convertedCheckDate <= convertedEndDate;
  }

}
