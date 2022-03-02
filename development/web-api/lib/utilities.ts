import { DocumentModel } from "orm/entity/document.entity";
import { EmailModel } from './model/EmailModel';
import { ResponseBody } from './orm/repository/responseBody';
import { Status } from './controller/base.controller';
import { getCustomRepository } from 'typeorm';
import { MailLogRepository } from "./orm/repository/mailLog.repository";
import { ContainerRepository } from './orm/repository/container.repository';
import { MailLog } from './orm/entity/mailLog.entity';
import { MailRepository } from './orm/repository/mail.repository';
import { Mail } from "orm/entity/mail.entity";


/**
 * generate code for request order
 */
//const generateCode="QMCHR-"+Math.floor(Math.random() * 1000000)+"-"+ Math.random().toString(36).substring(7)
const generateCode = "QMCHR-" + Math.floor(Math.random() * 1000000)
const path = require("path");
const fs = require("fs");

export class FileService {
      saveLocalDocument(file: DocumentModel) {
            try {
                  var dir = __dirname + '/document/' + file.folder;
                  let date = new Date();

                  if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                  }
                  fs.writeFile(dir + "/" + file.IDGenerate + "." + file.ext, file.file, 'base64', function (err) {
                        if (err) throw err
                        console.log('File saved.')
                  })
            } catch (error) {
                  console.log(error)
            }
      }

      readDocument(file) {
            var dir = __dirname + '/document';

            try {
                  return fs.readFileSync(dir + "/" + file, { encoding: 'base64' });
            }
            catch (err) {
                  return null;
            }
      }

      getModayInWeek() {
            let weekDay = ["Mon", "Tue", "Wed", "Thus", "Fri", "Sat", "Sun"]
            let date = new Date()
            // let week_number = 0 | new Date().getDate() / 7
            let result = '';
            if (weekDay[date.getDay() - 1] != "Mon") {
                  date.setDate(date.getDate() - date.getDay() + 1);
                  result = date.toLocaleDateString().replace("/", "_").replace("/", "_")
            }
            else {
                  result = date.toLocaleDateString().replace("/", "_").replace("/", "_")
            }
            return result
      }
}

//--------------------

const nodemailer = require("nodemailer");
export class Mailing {
      sendEmail(model: EmailModel, callback) {
            let responseBody = new ResponseBody<any>();
            // let sender = "No_Reply@CKSNTransport.com";
            // let password = "CKSN@2019";
            model.to = ["admin@cksntransport.com"];

            getCustomRepository(MailRepository).getEmail().then(res => {
                  if (res.status == Status.success) {
                        let mail = res.body[0] as Mail

                        var transporter = nodemailer.createTransport({
                              service: mail.mailService,
                              //   service: 'gmail',
                              auth: {
                                    user: mail.username,
                                    pass: mail.password
                              }
                        });
                        let text = '';
                        model.text.forEach(el => {
                              text = text + el;
                        })

                        var mailOptions = {
                              from: mail.username,
                              to: model.to.toString(),
                              subject: model.subject.toString(),
                              text: text
                        };


                        transporter.sendMail(mailOptions, function (error, info) {
                              if (error) {
                                    //   console.log(error);
                                    responseBody.body = ["error"]
                                    responseBody.status = Status.server_error
                                    callback(responseBody)
                              } else {
                                    //   console.log('Email sent: ' + info.response);
                                    let sentDate = new Date();
                                    responseBody.body = [sentDate]
                                    responseBody.status = Status.success
                                    callback(responseBody)

                                    try {
                                          let log = new MailLog()
                                          log.from = model.from
                                          log.to = model.to.toString()
                                          log.subject = model.subject
                                          log.sentDate = sentDate
                                          log.text = model.text.toString()
                                          log.byUser = model.byUser
                                          log.cksnFile = model.cksnFile
                                          log.byUser = model.byUser
                                          log.reference = model.reference

                                          log.status = 1

                                          getCustomRepository(MailLogRepository).addLog(log).then(rs => {
                                                console.log(rs)
                                          })
                                    }
                                    catch (error) {
                                          console.log(error)
                                    }

                              }
                        });
                  }
                  else {
                        responseBody.body = ["Somthing wrong with mail sending"]
                        responseBody.status = Status.logic_error
                        callback(responseBody)
                  }
            })
      }
}

export class DateUtil {
      static formatGMTDate(date) {
            date = new Date(date)
            //       var newDate = new Date(7 * 60 * 60000 + date.valueOf() + (date.getTimezoneOffset() * 60000));
            //    //   var ampm = newDate.getHours()<12?"AM":s"PM"
            //       var strDate = newDate + '';
            //       console.log(new Date(strDate))
            //     //  return new Date((strDate).substring(0,strDate.indexOf(" GMT"))+ampm);
            //     return new Date(strDate)
            return date.toLocaleString();
      }
}