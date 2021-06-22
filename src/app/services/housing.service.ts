import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Property } from '../model/property';
import { environment } from '../../environments/environment';
import { IKeyvaluepair } from '../model/iKeyvaluepair';


@Injectable({
    providedIn: 'root'
})
export class HousingService {


    constructor(private http: HttpClient) { }

    getAllCities(): Observable<string[]> {
        return this.http.get<string[]>('http://localhost:64078/api/city');
    }

    getFurnishingTypes(): Observable<IKeyvaluepair[]> {
      return this.http.get<IKeyvaluepair[]>('http://localhost:64078/api/furnishingtype/list');
    }

    getPropertyTypes(): Observable<IKeyvaluepair[]> {
      return this.http.get<IKeyvaluepair[]>('http://localhost:64078/api/propertytype/list');
    }


    getProperty(id: number): Observable<Property> {
        return this.http.get<Property>('http://localhost:64078/api/property/detail/' + id.toString());
    }

    getAllProperties(SellRent?: number): Observable<Property[]> {
        return this.http.get<Property[]>('http://localhost:64078/api/property/list/'+ SellRent.toString());
    }
    addProperty(property: Property) {
      return this.http.post('http://localhost:64078/api/property/add/',property);
    }

    newPropID() {
        if (localStorage.getItem('PID')) {
            localStorage.setItem('PID', String(+localStorage.getItem('PID') + 1));
            return +localStorage.getItem('PID');
        } else {
            localStorage.setItem('PID', '101');
            return 101;
        }
    }

    getPropertyAge(dateOfEstablishment: string): string
    {
      const today = new Date();
      const estDate = new Date(dateOfEstablishment);
      let age = today.getFullYear() - estDate.getFullYear();
      const m = today.getMonth() - estDate.getMonth();

      //current month smaller than establishment month or
      //same month but current date smaller than establishment date

      if (m < 0 || (m === 0 && today.getDate() < estDate.getDate())) {
        age --;
      }

      //Establishment date is future DATE
      if (today < estDate) {
        return '0';
      }

      //Age is less than a year
      if(age === 0) {
        return 'Less than a year';
      }

      return age.toString();

    }
}
