import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { PreData } from '../../../../model/pre.data';
import { CriterialFilter } from '../../../../model/filter/criterialFilter';
import { Criterial } from '../../../../services/predata/criterial';
import { StatusCode } from '../../../../utilities/StatusCode';
import { PredataService } from '../../../../services/predata/predata.service';
import { FilterService } from '../../../../services/component-service/filter.service';
import { DateFormatPipe } from '../../../../utilities/DateFormatPipe';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.css']
})
export class FilterDialogComponent implements OnInit {

  requestStatusList: PreData[]
  // criterialFilterObservation = new EventEmitter()
  criterialFilter = new CriterialFilter()


  // constructor(public dialogRef: MatDialogRef<FilterDialogComponent>,private predateService:PredataService) { }
  constructor(private predateService: PredataService, private datePip: DateFormatPipe, private appService: FilterService) { }

  ngOnInit() {
    this.getRequestStatusList();
  }

  getRequestStatusList() {
    this.predateService.getPreDefinedsByCriterial(Criterial.booking_status).subscribe(res => {
      if (res.status == StatusCode.success && res.body.length > 0) {
        this.requestStatusList = res.body
      }
    })
  }

  addFilter() {
    this.criterialFilter.fromDate = this.datePip.transform(this.criterialFilter.fromDate)
    this.criterialFilter.toDate = this.datePip.transform(this.criterialFilter.toDate)
    this.appService.setFilter(this.criterialFilter)
  }
}