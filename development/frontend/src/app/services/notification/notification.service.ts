import { Injectable } from '@angular/core';
import { BookingModel } from '../../model/booking.model';
import { Subject, Observable } from 'rxjs';
import 'rxjs/add/operator/map'

export enum Channel {
   login="login",
   notifi = "notitication"
}

export class Messages{
  channel:String
  data:any
  title:String
  subTitle:String
  descritpion:String
}


@Injectable({
  providedIn: 'root'
})
export class MessageBusService {

  private subject = new Subject<Messages[]>();

  sendMessage(message: Messages[]) {
      
      this.subject.next(message);
  }

  clearMessage() {
      this.subject.next();
  }

  getMessage(): Observable<any> {
      return this.subject.asObservable();
  }

}
