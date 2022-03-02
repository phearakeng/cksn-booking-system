import { JWTUtil } from './JWTGenerator';
import { getCustomRepository } from 'typeorm';
import { Status } from '../controller/base.controller';
import { TokenRepository } from '../orm/repository/token.repository';



/**
 * @author <auth>RINA </auth>
 */

/**
 * @param  req : Resquest,
 * @param  res : Response,
 * @param  role: array of string ,contain role
 * 
 * */
let authori_attr = async (req, res, next,roles:string[]) => {

  let token = req.headers['x-access-token'] || req.headers['authorization'] || ''; // Express headers are auto converted to lowercase

  if (token) {
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    else {
      res.status(401)
      return res.json({
        status: 401,
        message: 'Auth token is not valid.'
      });
    }
 

    let jwtUtil = new JWTUtil();
    let result = jwtUtil.verifyToken(token);
    var tokenRepo = getCustomRepository(TokenRepository);
    if (result != null) {
      // check with db
      var jti = result.jti
      var role = result.role; 

      // check role 
      let isGranted = false;
      if(roles!=null || roles.length>0){
        isGranted = roles.filter(r=>(r.toLowerCase()=="all") || r.toLowerCase()==role).length>0?true:false;
      }
     

    if(isGranted==true){
      var tokenReult = await tokenRepo.findToken(jti);
      console.log(tokenReult);
      if (tokenReult.status == Status.success && tokenReult.body.length > 0) {
        next();
      }
      else {
        res.status(401)
        return res.json({
          status: 401,
          message: 'Auth token is expires.'
        });
      }
    }
    else {
      res.status(401)
      return res.json({
        status: 401,
        message: 'Request is not granted!'
      });
    }
     
    }
    else {
      try {
        var decode = jwtUtil.decode(token);
        await tokenRepo.deleteToken(decode.jti);
      }
      catch (err) {
        console.error(err)
      }

      res.status(401)
      return res.json({
        status: 401,
        message: 'Auth token is not valid.'
      });
    }

  } else {
    res.status(401)
    return res.json({
      status: 401,
      message: 'Auth token is not supplied'
    });
  }
}



module.exports = {
  authori_attr: authori_attr
}
