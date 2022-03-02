
import { EntityRepository } from 'typeorm';
import { Repository } from 'typeorm';
import { ResponseBody } from '../../orm/repository/responseBody';
import { Status } from '../../controller/base.controller';
import { Page } from '../entity/page.entity';

@EntityRepository(Page)
export  class PageRepository extends Repository<Page> {

    getAllPages():Promise<any>{
        let resBody : ResponseBody<any> = new ResponseBody()
        try {
          return this.createQueryBuilder("page")
                     .where("page.isActive = 1")
                     .getMany().then(x=>{
                            resBody.body = x
                            resBody.status = Status.success
                            return Promise.resolve(resBody)
                     })
                     .catch(err=>{
                        resBody.body = [err]
                        resBody.status = Status.logic_error
                        return Promise.resolve(resBody)
                     });
            } catch (error) {
                resBody.status = Status.server_error
                resBody.body = [error]
                return Promise.resolve(resBody);
            }
        }
}