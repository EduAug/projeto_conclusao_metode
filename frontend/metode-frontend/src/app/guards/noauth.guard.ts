import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class noauthGuard implements CanActivate {
  constructor(private authService: AuthService, private route: Router){}

  canActivate(): boolean{
    if(this.authService.isAuthenticated()){
      this.route.navigate(['/manage']);
      return false;
    }
    return true;
  }
}