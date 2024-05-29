import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../shared/service/rest/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {

  errorMessage: string = "";
  isLoading: boolean = false;

  authSub: Subscription | undefined;

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(form: NgForm): void {

    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    let authObs: Observable<any>;

    authObs = this.authService.login(email, password);

    this.authSub = authObs.subscribe({
      next: (resData) => {
        const token = resData.token;
        this.authService.setToken(token);
        this.router.navigate(['/home']);
      },
      error: (errorMessage) => {
        alert(errorMessage);
      }
    });

  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }
}
