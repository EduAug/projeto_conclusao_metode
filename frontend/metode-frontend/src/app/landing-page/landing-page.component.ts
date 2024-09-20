import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginPopupComponent } from '../login-popup/login-popup.component';
import { SignupPopupComponent } from '../signup-popup/signup-popup.component';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  constructor(private dialog: MatDialog){}

  openLoginDialog(): void{
    this.dialog.open(LoginPopupComponent);
  }

  openSignupDialog(): void{
    this.dialog.open(SignupPopupComponent);
  }
}
