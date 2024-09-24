import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LabPageComponent } from './lab-page/lab-page.component';
import { ManagePageComponent } from './manage-page/manage-page.component';
import { noauthGuard } from './guards/noauth.guard';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  {path: '', redirectTo: '/landing', pathMatch: 'full'},
  {path: 'landing', component: LandingPageComponent, canActivate: [noauthGuard]},
  {path: 'lab', component: LabPageComponent},
  {path: 'manage', component: ManagePageComponent, canActivate: [authGuard]},
  {path: '**', redirectTo: '/landing'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
