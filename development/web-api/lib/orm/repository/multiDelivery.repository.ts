import { EntityRepository, Repository, getRepository, getCustomRepository, QueryBuilder, getManager, getConnectionManager, getConnection } from 'typeorm';
//import { DriverVehicleDetailRepository } from './vehicleDriver.repository';
import { ResponseBody } from './responseBody';
import { Status } from '../../controller/base.controller';
import { Mailing } from '../../utilities';
import { MultipleDelivery } from '../entity/multipleDelivery.entity';
/**
 * @Rina Chen
 */
@EntityRepository(MultipleDelivery)
export class MultiDeliveryRepository extends  Repository<MultipleDelivery>
{
        
}