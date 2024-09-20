import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddPopupComponent } from './add-popup/add-popup.component';
import { AddTextPopupComponent } from './add-text-popup/add-text-popup.component';
import { AddMathOperationComponent } from './add-math-operation/add-math-operation.component';
import { AddListOperationComponent } from './add-list-operation/add-list-operation.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LabPageComponent } from './lab-page/lab-page.component';
import { LoginPopupComponent } from './login-popup/login-popup.component';
import { SignupPopupComponent } from './signup-popup/signup-popup.component';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
@NgModule({
  declarations: [
    AppComponent,
    AddPopupComponent,
    AddTextPopupComponent,
    AddMathOperationComponent,
    AddListOperationComponent,
    LandingPageComponent,
    LabPageComponent,
    LoginPopupComponent,
    SignupPopupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    DragDropModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule
  ],
  providers: [
    provideAnimationsAsync('noop')
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
