import { EntityRepository } from "typeorm";
import { BookingCode } from "../entity/booking.code.entity";
import { Repository } from 'typeorm';

@EntityRepository(BookingCode)
export class BookingCodeRepository extends Repository<BookingCode>{}