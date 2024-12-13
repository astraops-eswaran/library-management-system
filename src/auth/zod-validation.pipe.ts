import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { ZodSchema } from "zod";


@Injectable()
export class ZodValidationPipe implements PipeTransform{
    //this pipe is used to validate the request body using zod
    constructor(private schema:ZodSchema<any>){}

    transform(value: any) {
        try{
            //parse the request body using the zod schema
            return this.schema.parse(value)
        }catch(e){
            throw new BadRequestException(e.errors)
        }
    }
}