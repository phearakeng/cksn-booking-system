import { Injectable } from '@angular/core';
import { CriterialFilter } from '../../model/filter/criterialFilter';
import { filter } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class FilterService {

  filter: CriterialFilter

  constructor() { }

  setFilter(filters:CriterialFilter){
     this.filter = filters
  }

  getFilter():CriterialFilter{
    return this.filter;
  }
  

}
