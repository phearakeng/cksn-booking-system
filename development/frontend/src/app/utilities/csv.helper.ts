import { rejects } from "assert";
import * as XLSX from 'xlsx';
import { DateFormatPipe } from './DateFormatPipe';

export class CSVHelper {
    public records: any[] = [];
    //  @ViewChild('csvReader') csvReader: any;  
    //   csvRecordsArray: any
    //   headersRow: any


    public async CSVFileReader($event: any) {

        let text = [];
        let files = $event.srcElement.files;
        if (this.isValidCSVFile(files[0])) {

            let input = $event.target;
            let reader = new FileReader();
            reader.readAsText(input.files[0]);

            return new Promise(resolve => {
                reader.onload = async () => {
                    let csvData = reader.result;
                    let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

                    let headersRow = this.getHeaderArray(csvRecordsArray);
                    resolve( this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow) );
                    //this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);  
                };

                reader.onerror = function (erro) {
                    console.log('error is occured while reading file!');

                };
            })

        } else {
            alert("Please import valid .csv file.");
            this.fileReset();
        }
    }



    isValidCSVFile(file: any) {
        return file.name.endsWith(".csv");
    }

    getHeaderArray(csvRecordsArr: any) {
        let headers = (<string>csvRecordsArr[0]).split(',');
        let headerArray = [];
        for (let j = 0; j < headers.length; j++) {
            headerArray.push(headers[j]);
        }
        return headerArray;
    }

    fileReset() {
        // this.csvReader.nativeElement.value = "";  
        this.records = [];
    }

    // use this method for 
    getDataRecordsArrayFromCSVFile(csvRecordsArray: any, header: any) {
        let csvArr = [];

        for (let i = 1; i < csvRecordsArray.length; i++) {
            let curruntRecord = (<string>csvRecordsArray[i]).split(',');
            if (curruntRecord.length == header.length) {
                var obj:any = {};
                curruntRecord.forEach((record: any, index: any) => {
                    obj[header[index]] = record;
                });
                csvArr.push(obj);
            }
        }
        return csvArr;
    }

  public  export(reportName, data) {
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
        /* save to file */
        XLSX.writeFile(wb, reportName + '.xlsx');
      }

}