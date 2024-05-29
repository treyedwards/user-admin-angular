import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { SearchComponent } from './search/search/search.component';
import { EditUserComponent } from './edit/edit-user/edit-user.component';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { AuthGuard } from './shared/service/rest/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent},
  { path: 'search', canActivate: [AuthGuard], component: SearchComponent},
  { path: 'edit', canActivate: [AuthGuard], component: EditUserComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: SignUpComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
