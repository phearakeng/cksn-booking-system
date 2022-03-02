import { JWTUtil } from './JWTGenerator';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../orm/repository/user.repository';
import * as jwt_decode from "jwt-decode";
import { User } from '../orm/entity/user';
import { Status } from '../controller/base.controller';
import { ResponseBody } from '../orm/repository/responseBody';
import { CryptoHelper } from '../helper/crypto.helper';
import { TokenRepository } from '../orm/repository/token.repository';
// import * as clientStore from '../helper/auth_store';
import { Token } from '../orm/entity/token.entity';

const clients = [
    {
        "client_id": "CK9999",
        "key": "99596168-f64f-489a-8679-c02eaf7b3d49"
    }
]

/**
 * @author <auth>RINA </auth>
 */
export class AuthenticationHandler {
    async token(req, res) {
        let response: ResponseBody<any> = new ResponseBody()
        var client_id = req.headers.client_id
        var key = req.headers.key
        let status: boolean = false;
        let tokenData = "";
        if (client_id != null && key != null) {
            let cStore = clients
            for (let cl of cStore) {
                if (cl.client_id == client_id && cl.key == key) {
                    status = true
                    break;
                }
            }
        }

        if (status == true) {
            status = false;// reset status
            let userRepo = getCustomRepository(UserRepository)
            let username = req.body.username;
            let password = CryptoHelper.decrypt_req(req.body.password);

            //   console.log(CryptoHelper.descrypt("516clZJAUErXWL/bJtl2rw=="))
            //    console.log("Password",password)
            let userRes = await userRepo.findUser(username, password);
            if (userRes.status == Status.success && userRes.body.length > 0) {
                let user = userRes.body[0] as User
                if (user != null) {
                    //      console.log(user.password)
                    //     CryptoHelper.decrypt_db(user.password)
                    if (user.password == password) {
                        // add more condition
                        let jwtUtil = new JWTUtil();
                        tokenData = jwtUtil.creatToken(43200, "" + user.ID, "" + user.group.group);
                        let decode = jwt_decode(tokenData)
                        // save token
                        let tokenModel = new Token()
                        tokenModel.jti = decode.jti
                        tokenModel.expirationDate = "" + decode.exp
                        tokenModel.userId = "" + user.ID
                        tokenModel.token = tokenData

                        let tokenRepo = getCustomRepository(TokenRepository)
                        let tokenRes = await tokenRepo.saveToken(tokenModel);
                        if (tokenRes.status == Status.success) {
                            status = true
                        }
                    }
                }
            }
            else {

                status = false
            }
        }
        // response
        if (status == true) {
            response.body = [{
                "type": "bearer",
                "access_token": tokenData
            }];
            response.status = Status.success
        }
        else {
            res.status(401)
            response.body = [{
                "erro_description": "Authorization is denied"
            }];
            response.status = Status.logic_error
        }
        res.json(response)
    }

    // check header
    async checkHeader(headers: any): Promise<any> {
        return new Promise(resolve => {
            try {
                return resolve(status)
            }
            catch (err) {
                console.log('error ')
                console.log(err);
                resolve(status)
            }
        })

    }

}
