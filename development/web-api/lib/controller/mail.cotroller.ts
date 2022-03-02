import { baseController } from './base.controller';
import { Request, Response} from "express";
import { EmailModel } from 'model/EmailModel';
import { Mailing } from '../utilities';

export class MailController extends baseController{

    constructor(){
        super()
        this.controllerName="/Mail/"
    }
   /**
    * @method sendMail
    * @param app s
    */
   public sendMail(app):void{
    app
    .post(this.controllerName+"sendMail",
    (req, res, next) => {
        this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
      },
        (req: Request, res: Response) => {
            let body = req.body as EmailModel
        
            new Mailing().sendEmail(body,function(status){
                 res.send(status)
            })
     })
   }
}