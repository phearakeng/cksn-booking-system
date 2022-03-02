
export class EmailModel {
    cc: String[]
    from: String
    to: String[]
    attachFile: String[]
    subject: String
    text: String[] // multil Line
    reference: any
    byUser: number
}