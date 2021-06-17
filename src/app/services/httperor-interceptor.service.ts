import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { error } from "@angular/compiler/src/util";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { of, throwError } from "rxjs";
import { catchError, concatMap, retry, retryWhen } from "rxjs/operators";
import { errorCode } from "../enums/enums";
import { AlertifyService } from "./alertify.service";

@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptorService implements HttpInterceptor {

  constructor(private alertify: AlertifyService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    console.log("Http request started");
    return next.handle(request)
      .pipe(
        retryWhen(error => this.retryRequest(error,10),
        ),
        catchError((error: HttpErrorResponse) => {
          const errorMessage = this.setError(error);
          console.log(error);
          this.alertify.error(errorMessage);
          return throwError(errorMessage);
        })

      );
  }

  //Retry the request in case of error
retryRequest(error: Observable<unknown>,retryCount: number) : Observable<unknown>
{
  return error.pipe(
    concatMap((checkErr : HttpErrorResponse, count: number) => {
      //retry in case WebAPI id down

      if (count <= retryCount)
      {
        switch(checkErr.status)
        {
          case errorCode.serverDown:
            return of(checkErr);

          // case errorCode.unauthorised:
          //   return of(checkErr);
        }
      }

      return throwError(checkErr);
    })
  )
}
  setError(error: HttpErrorResponse): string {
    let errorMessage = 'Unknown error occured';
    if (error.error instanceof ErrorEvent) {
      //cLIENT SIDE ERROR
      errorMessage = error.error.message;
    } else {
      //SERVER SIDE ERROR
      if (error.status !== 0) {
        errorMessage = error.error.errorMessage;
      }
    }
    return errorMessage;


  }
}
