let middleware = require('../authorization/AuthorizationServer');
export class baseController{
    mddileWare = middleware
   bearer="bearer"
   controllerName
   public status_code:Status   
   public data:any

    // role 
    roles_all = "all"
    role_admin="admin"  
    role_operation = "operation"

}

export enum Status {
    success="success",
    server_error="server_error",
    logic_error="logic_error"
}