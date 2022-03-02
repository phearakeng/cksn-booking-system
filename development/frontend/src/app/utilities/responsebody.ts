import { HttpErrorResponse } from '@angular/common/http';
import { Body } from '@angular/http/src/body';

export interface ResponseBody<T>{
    status:string
    message:String
    body:T[]
}

