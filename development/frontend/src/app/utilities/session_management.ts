import { UserModel } from '../model/user.model';

export class SessionManagement {

    
    setLoginSession(user:UserModel){
        localStorage.setItem("user",JSON.stringify(user))
    }
    getLoginSession(){
       return  JSON.parse(localStorage.getItem("user"))
    }

    removeLoginSession(){
        return localStorage.removeItem("user")
    }

    setUID(UID){
        localStorage.setItem("UID",UID)
    }

    getUID(){
      return  localStorage.getItem("UID")
    }

    remove(){
        localStorage.remove("UID")
    }


    getDoamin(){
        return localStorage.getItem("domain")
    }

    setDomain(val){
        localStorage.setItem("domain",val)
    }

    // setRefreshToken(token){
    //     localStorage.setItem("refresh_token",token)
    // }

    // getRefreshToken(){
    //    return localStorage.getItem("refresh_token")
    // }

    // removeRefreshToken(){
    //     localStorage.removeItem("refresh_token")
    // }

    // setIsLogout(isLogout){
    //       localStorage.setItem("isLogout",isLogout)
    // }

    // isLogout(){
    //     return localStorage.getItem("isLogout")
    // }

    setAcToken(token){
        localStorage.setItem("ac_token",token)
    }

    getAcToken(){
       return localStorage.getItem("ac_token")
    }

    removeAcToken(){
        localStorage.removeItem("ac_token")
    }




}