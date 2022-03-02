import { Pipe, PipeTransform} from '@angular/core';
import { DatePipe } from '@angular/common';

export const yyyy_mm_dd_hh_mm = 'yyyy/MM/dd hh:mm a'

@Pipe({
    name: 'dateFormat'
  })
  export class DateFormatPipe extends DatePipe implements PipeTransform {

   

    transform(value: any, args?: any): any {
       ///MMM/dd/yyyy 
       return super.transform(value, "yyyy/MM/dd");
    }

    formatdate(value: any,pattern): any {
      ///MMM/dd/yyyy 
      return super.transform(value,pattern);
   }

    dateDiff(firstDate:Date,secondDate:Date){
      // let firstDate = new Date("7/12/2017"),
      // secondDate = new Date("08/12/2017"),
     let timeDifference = Math.abs(secondDate.getTime() - firstDate.getTime());
      return Math.round(timeDifference/(1000 * 60 * 60 * 24))
    }

    yearDiff(firstDate:Date,secondDate:Date){
      // let firstDate = new Date("7/12/2017"),
      // secondDate = new Date("08/12/2017"),
     let timeDifference = Math.abs(secondDate.getTime() - firstDate.getTime());
      return Math.round(timeDifference/(1000 * 60 * 60 * 24))
    }


    addDays(date, days) {
      let result = new Date(date);
        result.setDate(result.getDate() + parseInt(days));
        return result;
    }

  }