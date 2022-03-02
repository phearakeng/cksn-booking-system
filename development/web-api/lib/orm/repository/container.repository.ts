import { EntityRepository, Repository, getRepository, getCustomRepository, QueryBuilder, getManager, getConnectionManager, getConnection } from 'typeorm';
//import { DriverVehicleDetailRepository } from './vehicleDriver.repository';
import { Container } from '../entity/container.entity';
import { ResponseBody } from './responseBody';
import { Status } from '../../controller/base.controller';
import { Mailing, DateUtil } from '../../utilities';
import { MultiDeliveryRepository } from './multiDelivery.repository';
import { MultipleDelivery } from '../entity/multipleDelivery.entity';
import { TruckRepository } from './truck.repository';
import { Booking } from '../entity/booking.entity';
import { BookingRepository } from './booking.repository';
import { threadId } from 'worker_threads';
import { UserRepository } from './user.repository';
import { PreDefinedFieldRepository } from './preDefined.repository';
/**
 * @Rina Chen
 */
@EntityRepository(Container)
export class ContainerRepository extends Repository<Container>
{

    /**
     * 
     * @param container 
     * @description for update existing record
     */
    async saveTheContainer(containers: Container) {
        try {
            console.log(containers)
            return await this.save(containers)
                .then(
                    async x => {
                        let res: ResponseBody<any> = new ResponseBody()
                        res.status = Status.success
                        res.body = ["Success"]
                        return Promise.resolve(res)
                    })



        } catch (error) {
            console.log(error)
            let res: ResponseBody<any> = new ResponseBody()
            res.status = Status.server_error
            res.body = [error]
            return Promise.resolve(res)
        }
    }

    /**
     * 
     * @param container 
     * @description for update existing record
     */
    async saveContainer(containers: Container[]) {
        try {
            //     containers.forEach(async container=>{
            for (var i = 0; i < containers.length; i++) {
                if (containers[i].pickUpDate != null) {
                    containers[i].pickUpDate = DateUtil.formatGMTDate(containers[i].pickUpDate)
                    // console.log(containers[i].pickUpDate);
                }
                if (containers[i].deliveryDate != null) {
                    containers[i].deliveryDate = DateUtil.formatGMTDate(containers[i].deliveryDate)
                }


                await this.save(containers[i])
                    .then(
                        async x => {
                            if (x.multiDelivery != undefined) {
                                containers[i].multiDelivery.forEach(async m => {
                                    m.containerID = x.ID
                                    await getCustomRepository(MultiDeliveryRepository).save(m)
                                })

                            }
                        })
            }
            let res: ResponseBody<any> = new ResponseBody()
            res.status = Status.success
            res.body = ["Success"]

            return Promise.resolve(res)
        } catch (error) {
            console.log(error)
            let res: ResponseBody<any> = new ResponseBody()
            res.status = Status.server_error
            res.body = [error]
            return Promise.resolve(res)
        }
    }

    /**
 * 
 * @param containerID 
 * @description for update existing record
 */
    removeContainerByID(containerID: number) {
        try {
            return this.update({ ID: containerID }, { isActive: 0 })
                .then(
                    x => {

                        let res: ResponseBody<any> = new ResponseBody()
                        res.status = Status.success
                        res.body = ["1"]
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
    * @method getListBookings
    * @param pageIndex 
    * @param pageSize 
    * @param bookingStatusID
    */
    getListCotainters(pageIndex, pageSize, containerStatusID, fromDate, toDate, userID, groupID, isViewAll): Promise<any> {
        let resBody: ResponseBody<any> = new ResponseBody()
        try {

            //  if(containerStatusID != 0)
            //     {
            return this.createQueryBuilder("container")
                .innerJoinAndSelect("container.booking", "booking")
                .leftJoinAndSelect("booking.operation", "operation")
                .leftJoinAndSelect("container.multiDelivery", "multiDelivery")
                .leftJoinAndSelect("booking.notifyParty", "notifyParty")
                .leftJoinAndSelect("booking.broker", "broker")
                .leftJoinAndSelect("container.truck", "truck")
                .leftJoinAndSelect("container.driver", "driver")
                .leftJoinAndSelect("container.containerStatus", "containerStatus")
                .orderBy("booking.ID", "DESC")
                .skip(pageIndex)
                .take(pageSize)
                .where("((container.pickUpDate is not null and container.deliveryDate is not null) and container.containerStatusID = :containerStatusID and container.isActive=1 and booking.isActive=1 and booking.operationID = :userID and (date(container.pickUpDate) >= :fromDate and date(container.pickUpDate) <= :toDate) and :isViewAll = false)",
                    { "containerStatusID": containerStatusID, "fromDate": fromDate, "toDate": toDate, "userID": userID, "isViewAll": isViewAll })
                .orWhere("((container.pickUpDate is not null and container.deliveryDate is not null) and 0 = :containerStatusID and container.isActive=1 and booking.isActive=1 and booking.operationID = :userID and (date(container.pickUpDate) >= :fromDate and date(container.pickUpDate) <= :toDate) and :isViewAll = false)",
                    { "containerStatusID": containerStatusID, "fromDate": fromDate, "toDate": toDate, "userID": userID, "isViewAll": isViewAll })
                .orWhere("((container.pickUpDate is not null and  container.deliveryDate is not null)  and  :containerStatusID = container.containerStatusID and container.isActive=1 and booking.isActive=1 and (container.pickUpDate >= :fromDate and date(container.pickUpDate) <= :toDate) and :isViewAll=true)  ",
                    { "containerStatusID": containerStatusID, "fromDate": fromDate, "toDate": toDate, "isViewAll": isViewAll })
                .orWhere("((container.pickUpDate is not null and  container.deliveryDate is not null)  and  :containerStatusID = 0 and container.isActive=1 and booking.isActive=1 and (container.pickUpDate >= :fromDate and date(container.pickUpDate) <= :toDate) and :isViewAll=true)  ",
                    { "containerStatusID": containerStatusID, "fromDate": fromDate, "toDate": toDate, "isViewAll": isViewAll })

                // .where("((container.pickUpDate is not null and container.deliveryDate is not null) and container.containerStatusID = :containerStatusID and container.isActive=1 and booking.isActive=1 and booking.operationID = :userID and (date(container.pickUpDate) >= :fromDate and date(container.pickUpDate) <= :toDate) and 3 <> :groupID)",
                //     { "containerStatusID": containerStatusID, "fromDate": fromDate, "toDate": toDate, "userID": userID, "groupID": groupID })

                // .orWhere("((container.pickUpDate is not null and  container.deliveryDate is not null)  and  :containerStatusID = 0 and container.isActive=1 and booking.isActive=1 and booking.operationID = :userID and (container.pickUpDate >= :fromDate and date(container.pickUpDate) <= :toDate) and 3 <> :groupID)  ",
                //     { "containerStatusID": containerStatusID, "fromDate": fromDate, "toDate": toDate, "userID": userID, "groupID": groupID })

                // .orWhere("(container.pickUpDate is not null and container.deliveryDate is not null and container.containerStatusID = :containerStatusID and container.isActive=1 and booking.isActive=1 and container.isActive=1 and booking.isActive=1 and (date(container.pickUpDate) >= :fromDate and date(container.pickUpDate) <= :toDate) and 3=:groupID)",
                //     { "containerStatusID": containerStatusID, "fromDate": fromDate, "toDate": toDate, "groupID": groupID })

                // .orWhere("(container.pickUpDate is not null and container.deliveryDate is not null and :containerStatusID = 0 and container.isActive=1 and booking.isActive=1 and  (date(container.pickUpDate)  >= :fromDate and date(container.pickUpDate) <= :toDate) and 3=:groupID)",
                //     { "containerStatusID": containerStatusID, "fromDate": fromDate, "toDate": toDate, "groupID": groupID })

                .getMany()
                .then(x => {
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
            //   }
        } catch (error) {
            console.log(error)
            resBody.status = Status.server_error
            resBody.body = [error]
            return Promise.resolve(resBody);
        }
    }

    /**
    * @@method getCountContainers
    */
    getCountContainers(containerStatusID, userID, groupID, fromDate, toDate, isViewAll): Promise<any> {

        try {
            //  if(containerStatusID!=0){
            return this.createQueryBuilder("container")
                .innerJoin("container.booking", "booking")
                //   .where("(container.pickUpDate is not null and container.deliveryDate is not null and container.isActive=1 and booking.isActive=1 and container.containerStatusID=:containerStatusID and booking.operationID = :userID) and (container.pickUpDate >= :fromDate and container.pickUpDate <= :toDate)  and 3 <> :groupID",{containerStatusID:containerStatusID,userID:userID,"fromDate":fromDate,"toDate":toDate,"groupID":groupID})
                //    .orWhere("(container.pickUpDate is not null and container.deliveryDate is not null and container.isActive=1 and booking.isActive=1 and 0 = :containerStatusID  and booking.operationID = :userID and (container.pickUpDate >= :fromDate and container.pickUpDate <= :toDate)  and 3 <> :groupID)",{containerStatusID:containerStatusID,userID:userID,"fromDate":fromDate,"toDate":toDate,"groupID":groupID})
                //   .orWhere("(container.pickUpDate is not null and container.deliveryDate is not null and container.isActive=1 and booking.isActive=1 and container.containerStatusID = :containerStatusID and :groupID=3 and (container.pickUpDate >= :fromDate and container.pickUpDate <= :toDate))",{containerStatusID:containerStatusID,groupID:groupID,"fromDate":fromDate,"toDate":toDate})
                //   .orWhere("(container.pickUpDate is not null and container.deliveryDate is not null and container.isActive=1 and booking.isActive=1 and 0 = :containerStatusID and :groupID=3 and (container.pickUpDate >= :fromDate and container.pickUpDate <= :toDate)) ",{containerStatusID:containerStatusID,groupID:groupID,"fromDate":fromDate,"toDate":toDate})
                .where("((container.pickUpDate is not null and container.deliveryDate is not null) and container.containerStatusID = :containerStatusID and container.isActive=1 and booking.isActive=1 and booking.operationID = :userID and (date(container.pickUpDate) >= :fromDate and date(container.pickUpDate) <= :toDate) and :isViewAll = false)",
                    { "containerStatusID": containerStatusID, "fromDate": fromDate, "toDate": toDate, "userID": userID, "isViewAll": isViewAll })
                .orWhere("((container.pickUpDate is not null and container.deliveryDate is not null) and 0 = :containerStatusID and container.isActive=1 and booking.isActive=1 and booking.operationID = :userID and (date(container.pickUpDate) >= :fromDate and date(container.pickUpDate) <= :toDate) and :isViewAll = false)",
                    { "containerStatusID": containerStatusID, "fromDate": fromDate, "toDate": toDate, "userID": userID, "isViewAll": isViewAll })
                .orWhere("((container.pickUpDate is not null and  container.deliveryDate is not null)  and  :containerStatusID = container.containerStatusID and container.isActive=1 and booking.isActive=1 and (container.pickUpDate >= :fromDate and date(container.pickUpDate) <= :toDate) and :isViewAll=true)  ",
                    { "containerStatusID": containerStatusID, "fromDate": fromDate, "toDate": toDate, "isViewAll": isViewAll })
                .orWhere("((container.pickUpDate is not null and  container.deliveryDate is not null)  and  :containerStatusID = 0 and container.isActive=1 and booking.isActive=1 and (container.pickUpDate >= :fromDate and date(container.pickUpDate) <= :toDate) and :isViewAll=true)  ",
                    { "containerStatusID": containerStatusID, "fromDate": fromDate, "toDate": toDate, "isViewAll": isViewAll })

                // .where("((container.pickUpDate is not null and container.deliveryDate is not null) and container.containerStatusID = :containerStatusID and container.isActive=1 and booking.isActive=1 and booking.operationID = :userID and (date(container.pickUpDate) >= :fromDate and date(container.pickUpDate) <= :toDate) and 3 <> :groupID)",
                //     { "containerStatusID": containerStatusID, "fromDate": fromDate, "toDate": toDate, "userID": userID, "groupID": groupID })

                // .orWhere("((container.pickUpDate is not null and  container.deliveryDate is not null)  and  :containerStatusID = 0 and container.isActive=1 and booking.isActive=1 and booking.operationID = :userID and (container.pickUpDate >= :fromDate and date(container.pickUpDate) <= :toDate) and 3 <> :groupID)  ",
                //     { "containerStatusID": containerStatusID, "fromDate": fromDate, "toDate": toDate, "userID": userID, "groupID": groupID })

                // .orWhere("(container.pickUpDate is not null and container.deliveryDate is not null and container.containerStatusID = :containerStatusID and container.isActive=1 and booking.isActive=1 and container.isActive=1 and booking.isActive=1 and (date(container.pickUpDate) >= :fromDate and date(container.pickUpDate) <= :toDate) and 3=:groupID)",
                //     { "containerStatusID": containerStatusID, "fromDate": fromDate, "toDate": toDate, "groupID": groupID })

                // .orWhere("(container.pickUpDate is not null and container.deliveryDate is not null and :containerStatusID = 0 and container.isActive=1 and booking.isActive=1 and  (date(container.pickUpDate)  >= :fromDate and date(container.pickUpDate) <= :toDate) and 3=:groupID)",
                //     { "containerStatusID": containerStatusID, "fromDate": fromDate, "toDate": toDate, "groupID": groupID })

                .getCount().then(
                    x => {
                        let res: ResponseBody<any> = new ResponseBody()
                        console.log("count ")
                        console.log(x)
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
     * @@method getContainerByID
     */
    getContainerByID(containerID): Promise<any> {
        try {
            return this.createQueryBuilder("container")
                .leftJoinAndSelect("container.truck", "truck")
                .leftJoinAndSelect("container.driver", "driver")
                .leftJoinAndSelect("truck.bizPartner", "bizPartner")
                .leftJoinAndSelect("container.gwUnitType", "gwUnitType")
                .leftJoinAndSelect("container.booking", "booking")
                .leftJoinAndSelect("booking.border", "border")
                .where("container.ID=:containerID", { containerID: containerID })
                .getOne().then(
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



    async saveDataImport(data: any) {
        let res: ResponseBody<any> = new ResponseBody()
        try {
            console.log(data)
            let bks = await getCustomRepository(BookingRepository).find({ CKSNFile: ("" + data.FILE_NO).trim() });
            if (bks.length > 0 && bks.length == 1) {
                let bk = bks[0];

                bk.remarks = "" + data.BOOKING_REMARK;
                // save container
                await getCustomRepository(BookingRepository).save(bk)

                /// check container 
                let containers = await this.find({ containerNo: ("" + data.CONTAINER_NO).trim() , bookingID: bk.ID });
                // if (containers.length <= 1) {
                if (containers.length == 1) {
                    // let container = containers.length==0?new Container(): containers[0];
                    let container = containers[0];
                   
                    container.bookingID = bk.ID;
                    
                    if (data.EMPTY_RETURN_DATE) {
                        container.emptyReturn = DateUtil.formatGMTDate(data.EMPTY_RETURN_DATE);
                    }

                    if (data.EMPTY_NOTIFY_AGENT) {
                        container.emptyNotifyAgent = DateUtil.formatGMTDate(data.EMPTY_NOTIFY_AGENT);
                    }

                    if (data.AGENT_PICKUP_EMPTY) {
                        container.agentPickUpEmpty = DateUtil.formatGMTDate(data.AGENT_PICKUP_EMPTY);
                    }

                    if (data.PICKUP_DATE) {
                        container.pickUpDate = DateUtil.formatGMTDate(data.PICKUP_DATE)
                    }

                    if (data.DELIVERY_DATE) {
                        container.deliveryDate = DateUtil.formatGMTDate(data.DELIVERY_DATE)
                    }

                    // find truck info
                    if (data.PLATE_NO) {
                        let truck = await getCustomRepository(TruckRepository).getTruckByPlateNo(data.PLATE_NO);
                        if (truck.status == Status.success && truck.body.length > 0) { container.truckID = truck.body[0].ID; }
                    }

                    // find driver  by phone
                    if (data.DRIVER_TEL) {
                        let driver = await getCustomRepository(UserRepository).findOne({ telephone1: "0" + Number(data.DRIVER_TEL) });
                        if (driver != undefined) { container.driverID = driver.ID; }
                    }

                    // container status
                    if (data.DELIVERY_STATUS) {
                        let resDStatus = await getCustomRepository(PreDefinedFieldRepository).getPreDefinedsByValue("containerStatus", ("" + data.DELIVERY_STATUS).toLowerCase());
                        if (resDStatus.status == Status.success && resDStatus.body.length > 0) { container.containerStatusID = resDStatus.body[0].ID; }
                    }

                    container.emptyDepo = data.DROP_OFF_DEPOT != undefined ? data.DROP_OFF_DEPOT : "";
                    container.extraDeliveryFee = "" + data.EXTRA_CHARGE;
                    //check container is existing
                    await this.save(container)
                        .then(
                            async x => {
                                res.status = Status.success
                                res.body = ["Success"]
                            })
                }
                else if (containers.length > 1) {
                    res.status = Status.logic_error
                    res.body = ["Container is duplicate"]
                }
                else {
                    res.status = Status.logic_error
                    res.body = ["Container is not existing"]
                }
            }
            else {
                res.status = Status.logic_error
                res.body = ["Booking is not existing"]
            }

            return Promise.resolve(res)
        } catch (error) {
            console.log(error)
            res.status = Status.server_error
            res.body = [error]
            return Promise.resolve(res)
        }
    }



    /**
    * @@method getMultiDropByContainers
    */
    async getMultiDropByContainers(containerID, isActive) {

        try {
            return await getCustomRepository(MultiDeliveryRepository)
                .find({ "containerID": containerID, "isActive": isActive })
                //  .where("container.containerStatusID=:containerStatusID",{containerStatusID:containerStatusID})
                .then(
                    x => {
                        let res: ResponseBody<any> = new ResponseBody()
                        res.status = Status.success
                        res.body = x
                        return Promise.resolve(res)
                    }
                )
        } catch (error) {
            let res: ResponseBody<any> = new ResponseBody()
            res.status = Status.server_error
            res.body = [error.message]
            return Promise.resolve(res)
        }
    }


    /**
    * @@method saveMultiDelivery
    */
    async saveMultiDelivery(mults: MultipleDelivery[]) {

        try {
            return await getCustomRepository(MultiDeliveryRepository)
                .save(mults)
                .then(
                    x => {
                        let res: ResponseBody<any> = new ResponseBody()
                        res.status = Status.success
                        res.body = x
                        return Promise.resolve(res)
                    }
                )
        } catch (error) {
            let res: ResponseBody<any> = new ResponseBody()
            res.status = Status.server_error
            res.body = [error.message]
            return Promise.resolve(res)
        }
    }





}