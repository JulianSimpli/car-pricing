import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { map, Observable } from 'rxjs'

// Interface that means any class
interface ClassConstructor {
  new(...args: any[]): {}
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) { }
  // context: Contiene información sobre la petición HTTP (request, response, handler, etc.)
  // next: Representa el siguiente paso en la cadena (tu controlador)
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    // Run something before a request is handled
    // console.log('I am running before the handler', context)

    // next.handle(): Ejecuta el controlador y obtiene el resultado
    return next.handle().pipe(
      map((data) => {
        // Run something before the response is sent out
        // data: lo que retorna el controlador
        // console.log('I am running before response is sent out', data);
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true // show properties with Expose() decorator
        })
      })
    )
  }
}