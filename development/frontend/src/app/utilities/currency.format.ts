export class CurencyFormat{
    format(val:String){
        return new Number(val).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
    }
}