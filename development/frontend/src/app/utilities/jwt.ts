import * as jwt_decode from "jwt-decode";
export class JWTHelper{
    token:any
    constructor(token:any){
        this.token = token
    }

    decode(){
       return jwt_decode(this.token)
    }
  
   getID(){
      let decode = jwt_decode(this.token)
        return decode?decode.id:null;
   } 

}