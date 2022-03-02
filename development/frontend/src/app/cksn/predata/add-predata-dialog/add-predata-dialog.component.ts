import { Component, OnInit, EventEmitter, ViewChild, Inject } from '@angular/core';
import { PredataService } from '../../../services/predata/predata.service';
import { StatusCode } from '../../../utilities/StatusCode';
import { PreData } from '../../../model/pre.data';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ComponentUtilities } from '../../../utilities/componentUtilities';
import { SessionManagement } from '../../../utilities/session_management';
import { Permission } from '../../../model/permission.model';
import { UserModel } from '../../../model/user.model';
import { Criterial } from '../../../services/predata/criterial';

@Component({
  selector: 'app-add-predata-dialog',
  templateUrl: './add-predata-dialog.component.html',
  styleUrls: ['./add-predata-dialog.component.scss']
})
export class AddPredataDialogComponent implements OnInit {

  displayedColumns: String[] = ["ID", "Value", "Status", "action"]
  public dataSourcePredata: MatTableDataSource<PreData> = new MatTableDataSource() // data source product to buy
  @ViewChild('tblPredata', { static: false }) tblPredata: MatTable<any>
  criterial: string
  onAddPredata = new EventEmitter()
  criterialSelected: PreData
  criterialAuoComplete = new FormControl()
  criterialList: PreData[] = []
  filteredCriterial: Observable<PreData[]>;
  session: SessionManagement = new SessionManagement()
  permission: Permission

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PreData,
    public dialogRef: MatDialogRef<AddPredataDialogComponent>,
    private matSnackbar: MatSnackBar,
    private predataService: PredataService) {
    this.criterialSelected = data ? data : undefined
    this.criterial = this.criterialSelected.criterial
    console.log(this.criterialSelected)
  }

  change(event) {
    this.criterialSelected.status = event.checked == true ? 1 : 0;
  }

  ngOnInit() {
    this.criterial = this.criterialSelected.criterial
    this.onLoadPredataByCriterial(this.criterialSelected.criterial);

    let user = this.session.getLoginSession() as UserModel
    this.permission = user.group.groupPermission.filter(res => res.pageID == Criterial.predataPageID)[0]
    if (this.permission && this.permission.isView == false) {
      ComponentUtilities.showNotification("Permission Denied", Criterial.warningNotify)
    }
  }

  onClick_Edit(predata: PreData) {
    this.criterialSelected = predata
    this.criterial = predata.criterial
  }

  onClick_Add() {
    if (this.criterialSelected) {
      if (this.criterialSelected.ID) {
        let predataEdit = this.dataSourcePredata.data.find(item => item.ID == this.criterialSelected.ID)
        if (predataEdit) {
          predataEdit.status = this.criterialSelected.status
          predataEdit.value = this.criterialSelected.value
        }
        this.criterialSelected = new PreData()
      }
      else if (this.criterialSelected.ID == undefined) {
        let predataEdit = this.dataSourcePredata.data.find(item => item.value == this.criterialSelected.value)
        if (!predataEdit) {
          this.criterialSelected.criterial = this.criterial
          this.dataSourcePredata.data.push(this.criterialSelected)
          this.tblPredata.renderRows();
        }
        this.criterialSelected = new PreData()
      }
    }
  }

  onClick_Save() {
    this.predataService.addPreData(this.dataSourcePredata.data).subscribe(res => {
      if (res.status == StatusCode.success) {
        this.matSnackbar.open(res.body[0].toString(), res.status, {
          duration: 2000,
        });
        this.dialogRef.close();
      }
      else {
        this.matSnackbar.open(res.body[0].toString(), res.status, {
          duration: 2000,
        });
      }
    })
  }

  onClick_No() {
    this.dialogRef.close();
  }

  onLoadPredataByCriterial(criterialSelected) {
    this.predataService.getListPredatas(criterialSelected, 0, 1000).subscribe(res => {
      console.log(res)
      if (res.status == StatusCode.success) {
        this.dataSourcePredata.data = res.body
      }
    })
  }

  applyFilter(filterValue: string) { }

  displayCriterial(value: PreData): string | undefined {
    return value ? value.criterial : undefined;
  }

  private filterCriterial(name: any): PreData[] {
    if (name && name.criterial != undefined) {
      const filterValue = name.criterial.toLowerCase();
      return this.criterialList.filter(option => option.criterial.toLowerCase().indexOf(filterValue) === 0);
    }
  }

  onCriterialValueChanged() {
    this.filteredCriterial = this.criterialAuoComplete.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value),
        map(name => name ? this.filterCriterial(name) : this.criterialList.slice())
      );
  }

  getSelectedCriterial(val) {
    if (val && val.criterial != undefined) {
      this.criterialSelected = val.criterial
    }
  }
}