import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserForLogin, UserForRegister } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = environment;

  constructor(private http: HttpClient) { }

  authUser(user: UserForLogin) {

    return this.http.post('http://localhost:64078/api/Account/login',user);

    // let UserArray = [];
    // if (localStorage.getItem('Users')) {
    //   UserArray = JSON.parse(localStorage.getItem('Users'));
    // }
    // return UserArray.find(p => p.userName === user.userName && p.password === user.password);
  }

  resgisterUser(user: UserForRegister)
  {
    return this.http.post('http://localhost:64078/api/Account/register',user);
  }

}
