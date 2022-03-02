const crypto = require('crypto');
const JSEncrypt = require('node-jsencrypt');
const fs = require("fs");
const CryptoJS = require("crypto-js");

// const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
//   modulusLength: 2048,
//   publicKeyEncoding: {
//     type: 'spki',
//     format: 'pem'
//   },
//   privateKeyEncoding: {
//     type: 'pkcs8',
//     format: 'pem'
//   }
// }); 

export class CryptoHelper {
  static crypt = new JSEncrypt();
  static encrypt_req(text) {
    let public_key = fs.readFileSync(__dirname + "/public.pem", 'utf8')

    this.crypt.setKey(public_key);
    return this.crypt.encrypt(text);
  }


  static decrypt_req(encrypted) {
    let privateKey = fs.readFileSync(__dirname + "/private.pem", 'utf8')
    this.crypt.setPrivateKey(privateKey);
    return this.crypt.decrypt(encrypted);
  }


  static encrypt_db(text) {
    var ciphertext = CryptoJS.AES.encrypt(text, '1').toString();
    return ciphertext;
  }


  static decrypt_db(ciphertext) {
    var bytes = CryptoJS.AES.decrypt(ciphertext, '1');
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  }


}