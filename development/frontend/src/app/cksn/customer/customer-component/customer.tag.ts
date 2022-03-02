import { Component, Input, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { CustomerModel } from '../../../model/customer.model';
import { CustomerService } from '../../../services/customer/customer.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { StatusCode } from '../../../utilities/StatusCode';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { NgEventBus } from 'ng-event-bus';
import { MetaData } from 'ng-event-bus/lib/meta-data';

@Component({
  selector: 'customer-tag',
  templateUrl: './customer.tag.html',
  //styleUrls: ['./customer-home.component.scss']
})
export class CustomerComponent implements OnInit {


  @Input()
  customerType: number;

  @Output()
  onValueChange: EventEmitter<any> = new EventEmitter();

  custCtrl: FormControl

  // list customer
  customers: CustomerModel[] = []
  //single obj
  customer: CustomerModel

  filteredCustomer: Observable<CustomerModel[]>

  constructor(private customerService: CustomerService) {
    this.custCtrl = new FormControl()
  }
  ngOnInit(): void {
    this.loadListCustomers(this.customerType);

  }

  // get data from http
  loadListCustomers(customerType) {
    this.customerService.getCustomerByType(customerType).subscribe(res => {
      if (res.status == StatusCode.success && res.body.length > 0) {
        try {
          this.customers = res.body
          this.customer = res.body[0];
          this.filteredCustomer = this.custCtrl.valueChanges.pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value ? value.name : ''),
            map(name => name ? this.onfiltered(name) : this.customers.slice())
          )
        } catch (error) {
          console.log(error)
        }
      }
    })
  }
  //#endregion customter

  // envent listnener
  displayCustomer(customer: CustomerModel) { return customer ? (customer.name) : undefined }
  onSelectionCustomerChanged(event: MatAutocompleteSelectedEvent) {
    if (event.option.value) {
      this.customer = event.option.value as CustomerModel
      this.onValueChange.emit([this.customer, this.customerType])
    }
  }
  onfiltered(name: String): CustomerModel[] { return this.customers.filter(cust => (cust.name).toLowerCase().includes(name.toLowerCase()) == true) }





}
