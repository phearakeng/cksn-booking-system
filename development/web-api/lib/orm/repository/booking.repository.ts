import { EntityRepository, Repository, getCustomRepository } from 'typeorm';
import { Booking } from '../entity/booking.entity';
import { ResponseBody } from '../../orm/repository/responseBody';
import { Status } from '../../controller/base.controller';
import { ContainerRepository } from './container.repository';
import { BookingCodeRepository } from './booking.code.repository';
import { parse } from 'path';
@EntityRepository(Booking)
export class BookingRepository extends Repository<Booking>{
    async saveBooking(booking: Booking) {
        let resBody: ResponseBody<any> = new ResponseBody()
        try {
            console.log(booking)
            let container = booking.container
            await getCustomRepository(ContainerRepository).saveContainer(container)
            booking.container = container
            if (this.hasNumber(booking.CKSNFile) == false) {
                return await getCustomRepository(BookingCodeRepository).findOne({ fileTypeID: booking.fileTypeID }).then(async res => {
                    let number = Number(res.value.toString()) + 1
                    let year = new Date().getFullYear().toString();
                    booking.CKSNFile = booking.CKSNFile + year.substring(2, 4) + "-";
                    let newID = res.value.toString().substring(0, res.value.toString().length - number.toString().length) + number
                    booking.CKSNFile = booking.CKSNFile + newID
                    res.value = newID

                    return await this.save(booking).then(async bcode => {
                        await getCustomRepository(BookingCodeRepository).save(res)
                        resBody.body = [bcode.ID]
                        resBody.status = Status.success
                        return Promise.resolve(resBody)
                    })
                        .catch(error => {
                            resBody.body = [error.message]
                            resBody.status = Status.logic_error
                            return Promise.resolve(resBody)
                        })
                })
            }
            else {
                return await this.save(booking).then(async bcode => {
                    resBody.body = [bcode.ID]
                    resBody.status = Status.success
                    return Promise.resolve(resBody)
                })
                    .catch(error => {
                        resBody.body = [error.message]
                        resBody.status = Status.logic_error
                        return Promise.resolve(resBody)
                    })
            }
        } catch (error) {
            resBody.body = [error.message]
            resBody.status = Status.server_error
            return Promise.resolve(resBody)
        }
    }

    /**
     * 
     * @param booking 
     */
    async removeBooking(bookingID: number) {
        let resBody: ResponseBody<any> = new ResponseBody()
        try {
            return await this.update({ ID: bookingID }, { isActive: 0 }).then(async res => {
                resBody.body = [1]
                resBody.status = Status.success
                return Promise.resolve(resBody)
            })
                .catch(error => {
                    resBody.body = [error.message]
                    resBody.status = Status.logic_error
                    return Promise.resolve(resBody)
                })
        } catch (error) {
            resBody.body = [error.message]
            resBody.status = Status.server_error
            return Promise.resolve(resBody)
        }
    }

    /**
       * @@method updateBookingStatus
       */
    updateBookingStatus(bookingID, statusID): Promise<any> {
        let res: ResponseBody<any> = new ResponseBody()
        try {
            return this.update({ ID: bookingID }, { bookingStatusID: statusID })
                .then(
                    x => {
                        res.status = Status.success
                        res.body = ["Success"]
                        return Promise.resolve(res)
                    }
                ).catch(err => {
                    res.status = Status.logic_error
                    res.body = [err.message]
                    return Promise.resolve(res)
                })
        } catch (error) {
            res.status = Status.server_error
            res.body = [error]
            return Promise.resolve(res)
        }
    }
    /**
  * @method getListBookings
  * @param pageIndex 
  * @param pageSize 
  * @param bookingStatusID
  */
    getListBookings(pageIndex, pageSize, bookingStatusID, fromDate, toDate, operationID, groupID, isViewAll): Promise<any> {
        let resBody: ResponseBody<any> = new ResponseBody()
        console.log(bookingStatusID, operationID, groupID, fromDate, toDate, isViewAll)
        try {
            return this.createQueryBuilder("booking")
                .innerJoinAndSelect("booking.operation", "operation")
                .leftJoinAndSelect("booking.customer", "customer")
                .leftJoinAndSelect("booking.businessPartner", "businessPartner")
                .orderBy("booking.ID", "DESC")
                .skip(pageIndex)
                .take(pageSize)
                .where("(booking.bookingStatusID = :bookingStatusID and booking.isActive = 1 and (date(booking.createDate) >= :fromDate and date(booking.createDate) <= :toDate) and (booking.operationID = :operationID and :isViewAll=false))",
                    { "bookingStatusID": bookingStatusID, "fromDate": fromDate, "toDate": toDate, "operationID": operationID, "isViewAll": isViewAll })
                .orWhere("(0 = :bookingStatusID and booking.isActive = 1 and (date(booking.createDate) >= :fromDate and date(booking.createDate) <= :toDate) and (booking.operationID = :operationID and :isViewAll=false))",
                    { "bookingStatusID": bookingStatusID, "fromDate": fromDate, "toDate": toDate, "operationID": operationID, "isViewAll": isViewAll })
                .orWhere("(:bookingStatusID=0 and booking.isActive = 1 and (date(booking.createDate) >= :fromDate and date(booking.createDate) <= :toDate) and :isViewAll=true)",
                    { "bookingStatusID": bookingStatusID, "fromDate": fromDate, "toDate": toDate, "isViewAll": isViewAll })
                .orWhere("(booking.bookingStatusID = :bookingStatusID and booking.isActive = 1 and (date(booking.createDate) >= :fromDate and date(booking.createDate) <= :toDate) and :isViewAll=true)",
                    { "bookingStatusID": bookingStatusID, "fromDate": fromDate, "toDate": toDate, "isViewAll": isViewAll })

                .getMany().then(x => {
                    resBody.body = x
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
    /**
    * @@method getCountBookings
    */
    getCountBookings(bookingStatusID, operationID, groupID, fromDate, toDate, isViewAll): Promise<any> {
        console.log(bookingStatusID, operationID, groupID, fromDate, toDate, isViewAll)
        try {
            return this.createQueryBuilder("booking")
                .where("(booking.bookingStatusID = :bookingStatusID and booking.isActive = 1 and (date(booking.createDate) >= :fromDate and date(booking.createDate) <= :toDate) and (booking.operationID = :operationID and :isViewAll=false))",
                    { "bookingStatusID": bookingStatusID, "fromDate": fromDate, "toDate": toDate, "operationID": operationID, "isViewAll": isViewAll })
                .orWhere("(0 = :bookingStatusID and booking.isActive = 1 and (date(booking.createDate) >= :fromDate and date(booking.createDate) <= :toDate) and (booking.operationID = :operationID and :isViewAll=false))",
                    { "bookingStatusID": bookingStatusID, "fromDate": fromDate, "toDate": toDate, "operationID": operationID, "isViewAll": isViewAll })
                .orWhere("(:bookingStatusID=0 and booking.isActive = 1 and (date(booking.createDate) >= :fromDate and date(booking.createDate) <= :toDate) and :isViewAll=true)",
                    { "bookingStatusID": bookingStatusID, "fromDate": fromDate, "toDate": toDate, "isViewAll": isViewAll })
                .orWhere("(booking.bookingStatusID = :bookingStatusID and booking.isActive = 1 and (date(booking.createDate) >= :fromDate and date(booking.createDate) <= :toDate) and :isViewAll=true)",
                    { "bookingStatusID": bookingStatusID, "fromDate": fromDate, "toDate": toDate, "isViewAll": isViewAll })
                .getCount().then(
                    x => {
                        let res: ResponseBody<any> = new ResponseBody()
                        res.status = Status.success
                        res.body = [x]
                        return Promise.resolve(res)
                    }
                )
        } catch (error) {
            let res: ResponseBody<any> = new ResponseBody()
            res.status = Status.server_error
            res.body = [error]
            return Promise.resolve(res)
        }
    }
    /**
     * 
     * @param ID 
     */
    getBookingByID(ID): Promise<any> {
        let resBody: ResponseBody<any> = new ResponseBody()
        try {
            return this.createQueryBuilder("booking")
                .leftJoinAndSelect("booking.carrier", "carrier")
                .leftJoinAndSelect("booking.businessPartner", "businessPartner")
                .leftJoinAndSelect("booking.container", "container")
                .leftJoinAndSelect("booking.customer", "customer")
                .leftJoinAndSelect("booking.border", "border")
                .leftJoinAndSelect("booking.pol", "pol")
                .leftJoinAndSelect("booking.pod", "pod")
                .leftJoinAndSelect("booking.operation", "operation")
                .leftJoinAndSelect("booking.broker", "broker")
                .leftJoinAndSelect("booking.bookingStatus", "bookingStatus")
                .leftJoinAndSelect("booking.billType", "billType")
                .leftJoinAndSelect("booking.incoterm", "incoterm")
                .leftJoinAndSelect("booking.notifyParty", "notifyParty")
                .leftJoinAndSelect("booking.consignee", "consignee")
                .leftJoinAndSelect("container.cbmUnitType", "cbmUnitType")
                .leftJoinAndSelect("container.gwUnitType", "gwUnitType")
                .leftJoinAndSelect("container.quantityUnitType", "quantityUnitType")
                .leftJoinAndSelect("booking.shipperExporterSeller", "shipperExporterSeller")
                .where("booking.ID=:ID", { ID: ID })
                .getMany().then(x => {
                    console.log((x as Booking[])[0].container)
                    let rr: ResponseBody<any> = new ResponseBody()
                    rr.body = x
                    rr.status = Status.success
                    return Promise.resolve(rr)
                })
                .catch(err => {
                    console.log(err)
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
    // ==========|GET GENERATE CODE|========== //
    getGenerateCKSNCode(ext: String) {
        try {
            let res: ResponseBody<any> = new ResponseBody()
            return this.createQueryBuilder("booking")
                .getCount().then(
                    x => {
                        let year = new Date().getFullYear().toString();
                        //    let CKSNFile = ext+(year.substring(2,4))+"-"+(Math.floor(Math.random() * 1000000))+(x+1); 
                        let trail = (Math.floor(Math.random() * 1000000)) + (x + 1);
                        ext = ext.substring(ext.indexOf("("), ext.length)
                        ext = ext.replace("(", "").replace(")", "").replace(" ", "");
                        ext = ext.replace("##-", year.substring(2, 4) + "-");
                        console.log(ext.substring(ext.indexOf("-"), ext.length))
                        ext = ext.replace(ext.substring(ext.indexOf("-"), ext.length), "-" + trail);

                        res.status = Status.success
                        res.body = [ext]
                        res.body = [ext]
                        return Promise.resolve(res)
                    }
                )
        }
        catch (error) {

        }
    }
    hasNumber(myString) {
        return /\d/.test(myString);
    }
    /**
   * @method getListBookings
   * @param pageIndex 
   * @param pageSize 
   * @param bookingStatusID
   */
    getBookingByCKSNNo(CKSNFile, operationID, groupID): Promise<any> {
        let resBody: ResponseBody<any> = new ResponseBody()
        try {
            return this.createQueryBuilder("booking")
                .select("booking.ID")
                .addSelect("booking.CKSNFile")
                .addSelect("booking.commodity")
                .addSelect("booking.etdPOL")
                .addSelect("booking.etaPOD")
                .addSelect("booking.ETABorder")
                .addSelect("booking.demDue")
                .addSelect("booking.detDue")
                .addSelect("booking.hbl")
                .addSelect("booking.mbl")
                .addSelect("customer.name")
                .addSelect("operation.lastName")
                .addSelect("operation.firstName")
                .addSelect("businessPartner.name")
                .addSelect("customer.ID")
                .addSelect("operation.ID")
                .addSelect("businessPartner.ID")
                .innerJoin("booking.operation", "operation")
                .innerJoin("booking.customer", "customer")
                .leftJoin("booking.businessPartner", "businessPartner")
                .where("(booking.CKSNFile = :CKSNFile and booking.isActive = 1 and booking.operationID = :operationID and 3 <> :groupID)",
                    { "CKSNFile": CKSNFile, "operationID": operationID, "groupID": groupID })
                .orWhere("(booking.CKSNFile = :CKSNFile and booking.isActive = 1  and 3=:groupID)",
                    { "CKSNFile": CKSNFile, "groupID": groupID })
                .getMany().then(x => {
                    console.log(x)
                    resBody.body = x
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
    //====================|-REPORTING-|====================//
    getBookingsReport(filter: FilterReportModel) {
        let resBody: ResponseBody<any> = new ResponseBody()
        try {
            return this.query("CALL sp_getBookingsReport('" +
                filter.fromDate + "', '"
                + filter.toDate + "','"
                + filter.customerID + "','"
                + filter.userOperationID + "','"
                + filter.bizPartnerID + "','"
                + filter.bookingStatusID + "','"
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
    // ====================|-DASHBOARD-|==================== //
    /**
 * @@method getCountDataInMonth()
 */
    getCountDataInMonth(): Promise<any> {
        let resBody: ResponseBody<any> = new ResponseBody()
        try {
            return this.query("CALL sp_getCountDataInMonth();")
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
    //====================|GET AMOUND BOKING PER MONTH|====================//
    getCountBookingStatusInMonth(): Promise<any> {
        let resBody: ResponseBody<any> = new ResponseBody()
        try {
            return this.query("CALL sp_getCountBookingStatusInMonth();")
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
    //====================|COUNT MONTHLY BOOKING|====================//
    getCountMonthlyBooking(): Promise<any> {
        let resBody: ResponseBody<any> = new ResponseBody()
        try {
            return this.query("CALL sp_getCountMonthlyBooking();")
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