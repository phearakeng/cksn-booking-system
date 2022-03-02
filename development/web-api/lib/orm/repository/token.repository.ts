
import { Token } from '../entity/token.entity';
import { ResponseBody } from './responseBody';
import { EntityRepository, Repository } from 'typeorm';
import { Status } from '../../controller/base.controller';

@EntityRepository(Token)
export class TokenRepository extends Repository<Token>{
    res: ResponseBody<any> = new ResponseBody()
    /**
     * 
     * @param token 
     * @description for save new ,delete (set by status), update existing record
     */
    async saveToken(token: Token) {
        try {
            return await this.save(token)
                .then(
                    async x => {
                        this.res.status = Status.success
                        this.res.body = ["Success"]
                        return Promise.resolve(this.res)
                    })
        } catch (error) {
            this.res.status = Status.server_error
            this.res.body = [error.message]
            return Promise.resolve(this.res)
        }
    }

    /**
 * 
 * @param jti 
 * @description find token by jti
 */
    async findToken(jti: String) {
        try {
            return await this.createQueryBuilder("token")
            .select().where("token.isActive=1 and jti= :jti",{jti:jti}).getMany()
                .then(
                    async x => {
                        this.res.status = Status.success
                        this.res.body = x.length > 0 ? x : []
                        return Promise.resolve(this.res)
                    })
        } catch (error) {
            this.res.status = Status.server_error
            this.res.body = [error.message]
            return Promise.resolve(this.res)
        }
    }


    /**
 * 
 * @param token 
 * @description find token by jti
 */
    async deleteToken(jti: String) {
        try {
            return await this.update({ 'jti': jti }, { isActive: 0 })
                .then(
                    async x => {
                        this.res.status = Status.success
                        this.res.body = ["Success"]
                        return Promise.resolve(this.res)
                    })
        } catch (error) {
            this.res.status = Status.server_error
            this.res.body = [error.message]
            return Promise.resolve(this.res)
        }
    }

}