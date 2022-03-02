import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CSVHelper } from '../../../../utilities/csv.helper';
import { ContainerService } from '../../../../services/container/container.service';
import { data } from 'jquery';
import { StatusCode } from '../../../../utilities/StatusCode';
import { NgEventBus } from 'ng-event-bus';
import { MetaData } from 'ng-event-bus/lib/meta-data';

@Component({
  selector: 'app-fleet-import-modal',
  templateUrl: './fleet-import-modal.component.html',
  styleUrls: ['./fleet-import-modal.component.css']
})
export class FleetImportModalComponent implements OnInit {

  file: any;
  importStatus = false;
  impSuccess = 0;
  impFail = 0;
  dataFailedRpt = []
  helper = new CSVHelper()
  @ViewChild('myInput')
  myInputVariable: ElementRef;

  constructor(private containerService: ContainerService, private eventBus: NgEventBus) {
    this.eventBus.on('app:modelopen').subscribe((meta: MetaData) => {
      console.log("meta", meta.data); // will receive 'started' only
      this.reset()
    });
  }

  ngOnInit(): void {
    console.log("object")
  }

  onFileChange(event) {
    this.file = event
  }

  reset() {
    this.myInputVariable.nativeElement.value = "";
    this.importStatus = false;
  }

  async onImport() {

    let dataCSV = await this.helper.CSVFileReader(this.file) as Array<any>;

    if (dataCSV.length > 0) {
      this.importStatus = true
      let count = 0;
      this.impSuccess = 0;
      this.impFail = 0;
      this.dataFailedRpt = []
      dataCSV.forEach(async element => {
        let res = await this.containerService.saveDataImport(element)
        res.subscribe(result => {
          // if success, remove from dataCSV
          if (result.status == StatusCode.success) {
            this.impSuccess += 1;
            dataCSV.splice(element, 1)
          }
          else {

            element.error = result.body[0]
            this.impFail += 1;
            this.dataFailedRpt.push(element)
          }
          count += 1;
          // status import
          if ((count - this.impSuccess) == dataCSV.length) {
            this.importStatus = false
            // if (this.impFail > 0) {
            //   this.dataFailedRpt = dataCSV;
            // }
          }
        });
      })
    }
  }

  exportEvent() {
    this.helper.export("Import failed report", this.dataFailedRpt)
  }

}
