import { AbstractControl, ValidatorFn } from "@angular/forms";
import * as libphonenumber from 'google-libphonenumber';

export class PhoneValidator{
    static validCountryPhone = (countryControl:AbstractControl):ValidatorFn =>{
        let subscribe = false
        return (phoneControl:AbstractControl):{[key: string]:boolean}=>{
            if(!subscribe){
                subscribe = true;
                countryControl.valueChanges.subscribe(()=>{
                    phoneControl.updateValueAndValidity();
                })
            }
            if (phoneControl.value !== ''){
                try {
                    const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
                    const phoneNumber = ''+ phoneControl.value +''
                    const region = countryControl.value
                    const pNumber = phoneUtil.parseAndKeepRawInput(phoneNumber,region.iso)
                    const isValidNumber = phoneUtil.isValidNumber(pNumber)
                    if (isValidNumber){
                        return undefined!
                    }
                } catch (error) {
                  //  console.log(error);
                  return {validCountryPhone: true };
                }
                return {
                    validCountryPhone: true
                  };
            }
            else{
                return undefined!
            }
        }
    }
}