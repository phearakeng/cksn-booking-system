import { Repository } from "typeorm";
import { Truck } from "../entity/truck.entity";
import { EntityRepository } from 'typeorm';
import { ResponseBody } from './responseBody';
import { Status } from '../../controller/base.controller';

@EntityRepository(Truck)
export class TruckRepository extends Repository<Truck>{

    /**
     * 
     * @param truck 
     * @description for save new ,delete (set by status), update existing record
     */
    async saveTruck(truck: Truck) {
        try {
            return await this.save(truck)
                .then(
                    async x => {
                        let res: ResponseBody<any> = new ResponseBody()
                        res.status = Status.success
                        res.body = ["Success"]
                        return Promise.resolve(res)
                    })
        } catch (error) {
            let res: ResponseBody<any> = new ResponseBody()
            res.status = Status.server_error
            res.body = [error.message]
            return Promise.resolve(res)
        }
    }

    async getAllTrucks(pageSize, pageIndex) {
        let res: ResponseBody<any> = new ResponseBody()
        try {
            return await this.createQueryBuilder("truck")
                .leftJoinAndSelect("truck.bizPartner", "bizPartner")
                .where("status=1")
                .skip(pageIndex)
                .take(pageSize)
                .getMany()
                .then(x => {
                    res.body = x
                    res.status = Status.success
                    return Promise.resolve(res)
                })
                .catch(error => {
                    res.body = [error]
                    res.status = Status.logic_error
                    return Promise.resolve(res)
                })
        }
        catch (error) {
            res.body = [error]
            res.status = Status.server_error
            return Promise.resolve(res)
        }
    }

    async getCountTrucks() {
        let res: ResponseBody<any> = new ResponseBody()
        try {
            return await this.createQueryBuilder("truck")
                .where("status=1")
                .getCount()
                .then(x => {
                    res.body = [x]
                    res.status = Status.success
                    return Promise.resolve(res)
                })
                .catch(error => {
                    res.body = [error]
                    res.status = Status.logic_error
                    return Promise.resolve(res)
                })
        }
        catch (error) {
            res.body = [error]
            res.status = Status.server_error
            return Promise.resolve(res)
        }
    }




    async getAllTruck() {
        let res: ResponseBody<any> = new ResponseBody()
        try {
            return await this.createQueryBuilder("truck")
                .leftJoinAndSelect("truck.bizPartner", "bizPartner")
                .where("status=1")
                .getMany()
                .then(x => {
                    res.body = x
                    res.status = Status.success
                    return Promise.resolve(res)
                })
                .catch(error => {
                    res.body = [error]
                    res.status = Status.logic_error
                    return Promise.resolve(res)
                })
        }
        catch (error) {
            res.body = [error]
            res.status = Status.server_error
            return Promise.resolve(res)
        }
    }


    async getListTruck() {
        let res: ResponseBody<any> = new ResponseBody()
        try {
            return await this.createQueryBuilder("truck")
                .getMany()
                .then(x => {
                    res.body = x
                    res.status = Status.success
                    return Promise.resolve(res)
                })
                .catch(error => {
                    res.body = [error]
                    res.status = Status.logic_error
                    return Promise.resolve(res)
                })
        }
        catch (error) {
            res.body = [error]
            res.status = Status.server_error
            return Promise.resolve(res)
        }
    }

    getListTruckByDriver() {

        let res: ResponseBody<any> = new ResponseBody()
        try {
            return this.createQueryBuilder("truck")
                .select("truck")
                //  .addSelect("driver.lastName")
                //  .addSelect("driver.firstName")
                //  .addSelect("driver.telephone1")
                .addSelect("truck.plateNo")
                //  .innerJoin("truck.driver","driver")
                // .where("user.positionID='21'")
                .getMany()
                .then(x => {
                    res.body = x
                    res.status = Status.success
                    return Promise.resolve(res)
                })
                .catch(error => {
                    res.body = [error]
                    res.status = Status.success
                    return Promise.resolve(res)
                })
        }
        catch (error) {
            res.body = [error]
            res.status = Status.success
            return Promise.resolve(res)
        }

    }

    getTruckByPlateNo(plateno) {

        let res: ResponseBody<any> = new ResponseBody()
        try {
             // this.find({plateNo: (""+plateno).trim().toLowerCase()})
           return this.createQueryBuilder("truck")
             .select("truck")
             .where("LOWER(TRIM(truck.plateNo))=:plateno",{plateno:plateno.trim().toLowerCase()})
             .getOne()
                .then(x => {
                    res.body = [x]
                    res.status = Status.success
                    return Promise.resolve(res)
                })
                .catch(error => {
                    res.body = [error]
                    res.status = Status.success
                    return Promise.resolve(res)
                })
        }
        catch (error) {
            res.body = [error]
            res.status = Status.success
            return Promise.resolve(res)
        }

    }
}