import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  isAuthenticated(): boolean{
    const token= sessionStorage.getItem('token');
    return !!token;
  }

  logout() {
    sessionStorage.removeItem('token');
  }
}
