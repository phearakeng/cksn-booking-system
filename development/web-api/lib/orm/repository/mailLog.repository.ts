
import { EntityRepository } from 'typeorm';
import { Repository } from 'typeorm';
import { ResponseBody } from '../../orm/repository/responseBody';
import { Status } from '../../controller/base.controller';
import { Page } from '../entity/page.entity';
import { MailLog } from '../entity/mailLog.entity';

@EntityRepository(MailLog)
export  class MailLogRepository extends Repository<MailLog> {

    addLog(mail:any):Promise<any>{
        let resBody : ResponseBody<any> = new ResponseBody()
        try {
          return this.save(mail).then(x=>{
                            resBody.body = ["1"]
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