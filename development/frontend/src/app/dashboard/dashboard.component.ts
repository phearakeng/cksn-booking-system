import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TableData } from '../md/md-table/md-table.component';
import { LegendItem, ChartType } from '../md/md-chart/md-chart.component';

import * as Chartist from 'chartist';
import { DashboardService } from '../services/dashbaord/dashboard.service';
import { StatusCode } from '../utilities/StatusCode';
import { Criterial } from '../services/predata/criterial';
import { UserModel } from '../model/user.model';
import { ComponentUtilities } from '../utilities/componentUtilities';
import { Permission } from '../model/permission.model';
import { BaseComponent } from '../cksn/baseComponent';
import { Router } from '@angular/router';

declare const $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent extends BaseComponent implements OnInit {

  bookingNumber: any
  containerNumber: any
  deliveredNumber: any
  isViewAble: any = false

  public tableData3: any;
  constructor(private service: DashboardService, public router: Router) {
    super(router)
  }
  public ngOnInit() {
    let user = this.session.getLoginSession() as UserModel
    this.permission = user.group.groupPermission.filter(res => res.pageID == Criterial.dashboardID)[0]

    if (user.group != undefined) {
      if (user.group.ID != 3) {
        return;
      }
      else {
        this.isViewAble = true
      }
    }

    if (this.permission.isView == true) {
      this.getCountMonthlyBooking()
      this.getCountBookingStatusInMonth()
      this.getCountDataInMonth()
    }
    else {
      ComponentUtilities.showNotification("Permission Denied", Criterial.warningNotify)
    }
  }

  getCountMonthlyBooking() {
    this.service.getCountMonthlyBooking().subscribe(res => {
      console.log(res)
      if (res.status == StatusCode.success) {

        let arrayItem = []
        res.body.forEach(ele => {
          arrayItem.push(Number(ele.Number))
        });

        new Chartist.Bar('#simpleBarChart',
          {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            series: [arrayItem]
          },
          {
            high: 1500
          }
        );
      }
    })
  }

  getCountBookingStatusInMonth() {
    this.service.getCountBookingStatusInMonth().subscribe(res => {
      //   console.log(res)
      if (res.status == StatusCode.success) {
        let array = []
        let No: number = 0
        res.body.forEach(ele => {
          No = No + 1;
          let itemArrayList = [No, ele.Status, ele.Number]
          array.push(itemArrayList)
        });
        this.tableData3 = {
          headerRow: ['No', 'Status', 'Number', ''],
          dataRows: array
        };
      }
    })
  }

  getCountDataInMonth() {
    this.service.getCountDataInMonth().subscribe(res => {
      if (res.status == StatusCode.success) {
        if (res.body != undefined || res.body.length == 3) {
          this.bookingNumber = res.body[0].Number
          this.containerNumber = res.body[1].Number
          this.deliveredNumber = res.body[2].Number
        }
      }
    })
  }
}
