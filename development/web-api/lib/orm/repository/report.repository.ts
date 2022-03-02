import { ResponseBody } from './responseBody';
import { getConnection } from 'typeorm';
import { Status } from '../../controller/base.controller';
export class ReportRepository {
     //reporting
     getEmptyReport(filter: FilterReportModel):Promise<any> {
        let resBody: ResponseBody<any> = new ResponseBody()

        try {
            return getConnection().query("CALL sp_getEmptyReport('" +
                filter.fromDate + "', '"
                + filter.toDate + "','"
                + filter.customerID + "','"
                + filter.userOperationID + "','"
                + filter.bizPartnerID + "','"
                + filter.bookingStatusID+ "','"
                + filter.selectionDate
                + "');")
                .then(x => {
                    resBody.body = x[0]
                    resBody.status = Status.success
                    return Promise.resolve(resBody)
                })
                .catch(err => {
                    let rr: ResponseBody<any> = new ResponseBody()
                    rr.body = [err]
                    rr.status = Status.logic_error
                    return Promise.resolve(rr)
                });

        } catch (error) {
            console.log(error)
            resBody.status = Status.server_error
            resBody.body = [error]
            return Promise.resolve(resBody);
        }
    }


    getConsoleReport(filter: FilterReportModel):Promise<any> {
        let resBody: ResponseBody<any> = new ResponseBody()

        try {
            return getConnection().query("CALL sp_getConsoleReport('" +
                filter.fromDate + "', '"
                + filter.toDate + "','"
                + filter.customerID + "','"
                + filter.userOperationID + "','"
                + filter.bizPartnerID + "','"
                + filter.bookingStatusID+ "','"
                + filter.selectionDate
                + "');")
                .then(x => {
                    resBody.body = x[0]
                    resBody.status = Status.success
                    return Promise.resolve(resBody)
                })
                .catch(err => {
                    let rr: ResponseBody<any> = new ResponseBody()
                    rr.body = [err]
                    rr.status = Status.logic_error
                    return Promise.resolve(rr)
                });

        } catch (error) {
            console.log(error)
            resBody.status = Status.server_error
            resBody.body = [error]
            return Promise.resolve(resBody);
        }
    }

}