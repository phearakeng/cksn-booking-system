import { text } from "../../node_modules/@types/body-parser";

export class EmailModel {
    cc: String[]
    from: String
    to: String[]
    attachFile: String[]
    subject: String
    text: String[] // multil Line
    byUser: number
    cksnFile: String
    reference: string
}