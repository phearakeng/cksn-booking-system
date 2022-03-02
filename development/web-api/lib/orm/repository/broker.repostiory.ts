import { User } from '../entity/user';
import { EntityRepository, Repository, getRepository, getCustomRepository, QueryBuilder, getManager } from 'typeorm';
//import { DriverVehicleDetailRepository } from './vehicleDriver.repository';
import { Status } from '../../controller/base.controller';
import { ResponseBody } from './responseBody';
import { resolve } from 'path';
import { Department } from '../entity/department';
import { Broker } from '../entity/broker.entity';

/**
 * @Rina Chen
 */
@EntityRepository(Broker)
export class BrokerRepository extends Repository<Broker>
{
    /**
     * @method getAllBrokers
     */
    getAllBrokers(): Promise<any> {
        let resBody: ResponseBody<any> = new ResponseBody()
        try {
            resBody.status = Status.success
            return this.createQueryBuilder("broker")
                .where("broker.isActive='1'")
                .getMany().then(x => {
                    let rr: ResponseBody<any> = new ResponseBody()
                    rr.body = x
                    rr.status = Status.success
                    return Promise.resolve(rr)
                })
                .catch(err => {
                    let rr: ResponseBody<any> = new ResponseBody()
                    rr.body = [err]
                    rr.status = Status.success
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