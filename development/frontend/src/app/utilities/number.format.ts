export class NumberFormat {


    public static isNumber(val) {
        try {
            let n = Number(val);
            return true;
        } catch (error) {
            return false;
        }
    }

}