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
 public static encrypt_req(text) {
  // let public_key = fs.readFileSync(__dirname+"/public.pem", 'utf8' )
  
    this.crypt.setKey(`-----BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyKKVoHapcOkZz1grI5eY
    OyfM6Ob8OTkSTCICYofNjp70aDc1ioH9cznsIND/wCfRO47lHKai8Gu/H/XatFVX
    k0K5XWxrSGyIyu+KhuXLOeqbSXiVol0uHJFgIvXQbMKm09Rs5+MwbE4pqoKFsHHC
    vJcgANWy/drxBbhePdAxIsLj5qV6AO/xh/Ic+V2Yg3Z46NGfb5hlNrJtQu1QNjix
    MYtESqxdzpdk45OPx3eBUiPei+VGoCXEoCrHBMqBclV+9g8c31X2+23L9AwCV1Ec
    M46p/Jx/bVTLNPK4ALC9UQ/0mFpf5H/tacCO/jAhPF6yE5qNeX1Xc4Bl3VsyvkdQ
    hQIDAQAB
    -----END PUBLIC KEY-----`);
    return this.crypt.encrypt(text);
  }
 
}