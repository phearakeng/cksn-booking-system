export class PortModel {
    ID: number
    country: string
    port: string
    code: string
    latlong: string
    telephone: string
    web: string
    portType: number
    createDate: string
    isActive: number
}
export class PostingPort {
    country: string
    port: string
    code: string
    latlong: string
    telephone: string
    web: string
    portType: number
    isActive: number = 1
}