import { Component, OnInit, ViewChild } from '@angular/core';
import { PreData } from '../../model/pre.data';
import { MatTableDataSource} from '@angular/material/table';
import { MatTable} from '@angular/material/table';
import { MatSort} from '@angular/material/sort';
import { PageEvent} from '@angular/material/paginator';
import { MatSnackBar} from '@angular/material/snack-bar';
import { MatDialog} from '@angular/material/dialog';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { PredataService } from '../../services/predata/predata.service';
import { StatusCode } from '../../utilities/StatusCode';
import { FormControl } from '@angular/forms';
import {Observable} from 'rxjs';
import { map, startWith, filter } from 'rxjs/operators';
import { Criterial } from '../../services/predata/criterial';
import { AddPredataDialogComponent } from './add-predata-dialog/add-predata-dialog.component';
import { SessionManagement } from '../../utilities/session_management';
import { Permission } from '../../model/permission.model';
import { UserModel } from '../../model/user.model';
import { ComponentUtilities } from '../../utilities/componentUtilities';
import { BaseComponent } from '../baseComponent';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';

declare const $: any;

@Component({
  selector: 'app-predata',
  templateUrl: './predata.component.html',
  styleUrls: ['./predata.component.scss']
})
export class PredataComponent  extends BaseComponent  implements OnInit {

  ALL="all";

  displayedColumns: String[] =  ["Description","Criterial","action"]
  public dataSourcePredata:MatTableDataSource<PreData>=new MatTableDataSource() // data source product to buy
  @ViewChild('tblPredata',{static: false}) tblUser: MatTable<any>
  
  predata:PreData
  pageLength=0;
  pageSize=50;
  pageSizeOptions: number[] = [50,100,300];
  pageIndex:number;
  // MatPaginator Output
  pageEvent: PageEvent;
  
  criterialSelected:string
  criterialAuoComplete = new FormControl()
  criterialList:PreData[]=[]
  filteredCriterial: Observable<PreData[]>;

  session:SessionManagement = new SessionManagement()
  permission : Permission
 
  constructor(private dialog:MatDialog,private predataService:PredataService,public route:Router) {
        super(route)
   }

  ngOnInit() {
    
    let  user = this.session.getLoginSession() as UserModel
    this.permission = user.group.groupPermission.filter(res=>res.pageID==Criterial.predataPageID)[0]  
    if(this.permission && this.permission.isView==true)
    {
      this.onLoadCriterialList();
      this.criterialSelected = this.ALL
      this.getCountPredatas(this.ALL)
      this.onLoadPredataByCriterial()
    }
    else{
         ComponentUtilities.showNotification("Permission Denied",Criterial.warningNotify)
    }
  }

  onLoadCriterialList(){
    this.predataService.getListCriterial().subscribe(x=>{
      if(x.status==StatusCode.success){
       
          let p = new PreData()
              p.criterial = this.ALL
          this.criterialList.push(p)
          this.criterialList = this.criterialList.concat(x.body)
          this.onCriterialValueChanged()
      }
    })
  }
              

  onLoadPredataByCriterial(){
      this.predataService.getListPredatas(this.criterialSelected,this.pageIndex,this.pageSize).subscribe(res=>{
        if(res.status==StatusCode.success){
              this.dataSourcePredata.data = res.body
              this.dataSourcePredata.data.forEach(d=> {if(d.value !=null){
                d.description =  d.value
              }})
           }
      })
  }

 

  applyFilter(filterValue: string) {
     this.dataSourcePredata.filter = filterValue.trim().toLowerCase();
  }

  displayCriterial(value:PreData):string | undefined{
    return value ? value.criterial : undefined;
  }

  private filterCriterial(name: any): PreData[] {
    console.log(name)
    return this.criterialList.filter(option => 
          option.criterial.toLowerCase().includes(name)
        );
}

  onCriterialValueChanged(){
    this.filteredCriterial = this.criterialAuoComplete.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value),
      map(name => name ? this.filterCriterial(name) : this.criterialList.slice()),
    );

  }

  getSelectedCriterial(val){
    if(val && val.criterial != undefined){
      this.criterialSelected = val.criterial
      this.getCountPredatas(this.criterialSelected)
      this.onLoadPredataByCriterial()
    }
  }


  getCountPredatas(criterial){
      this.predataService.getCountPredatas(criterial).subscribe(res=>{
        if(res.status==StatusCode.success){
          this.pageLength = res.body[0]
        
        }
      })
  }

  paginatorEvent(event){
    this.pageIndex = ((event.pageIndex) * event.pageSize )
    this.pageSize = event.pageSize
    if(this.criterialSelected){
      this.onLoadPredataByCriterial()
    }
    
  }


  onClick_New(){
      let new_predata = new PreData()
          new_predata.criterial = this.criterialSelected
      this.openPredataDialog(new_predata)
  }

  onClick_Edit(predata:PreData){
    this.openPredataDialog(predata)
  }

  displayedColumnsEdit: String[] =  ["ID","Value","Status","action"]
  public dataSourcePredataEdit:MatTableDataSource<PreData>=new MatTableDataSource() // data source product to buy
  @ViewChild('tblPredata',{static: false}) tblPredataEdit: MatTable<any>
  criterial:string

  openPredataDialog(predata:PreData){

    // $("#editorModal").modal('toggle');
    const dialogRef =  this.dialog.open(AddPredataDialogComponent,{data:predata,height: "600",width: '500px',})
        //    .componentInstance.onAddPredata.subscribe((data: PreData) => {});
      dialogRef.afterClosed().subscribe(result => {
        this.criterialSelected = this.ALL
           this.onLoadPredataByCriterial()
      });
 }

}
