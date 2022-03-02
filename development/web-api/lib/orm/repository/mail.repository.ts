
import { EntityRepository } from 'typeorm';
import { Repository } from 'typeorm';
import { ResponseBody } from '../../orm/repository/responseBody';
import { Page } from '../entity/page.entity';
import { MailLog } from '../entity/mailLog.entity';
import { Mail } from '../entity/mail.entity';
import { Status } from '../../controller/base.controller';

@EntityRepository(Mail)
export  class MailRepository extends Repository<Mail> {

    getEmail():Promise<ResponseBody<any>>{
        let resBody : ResponseBody<any> = new ResponseBody()
        try {
          return this.findOne({status:1}).then(x=>{
                            resBody.body = [x]
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