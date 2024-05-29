import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { User } from '../../model/User';


export interface AuthResponseData {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string | undefined;

  user = new BehaviorSubject<User>(new User(-1, "", "", "", "", "", "", []));
  private tokenExpirationTimer: any;


  constructor(private http:HttpClient, private router: Router) {}

  public getToken(): string | undefined{
    return this.token;
  }

  public setToken(token: string): void {
    this.token = token;
  }

  login(userName: string, password: string) {
    return this.http.post<AuthResponseData>(
      "http://localhost:8080/auth/login",
      {
        username: userName,
        password: password
      }
    ).pipe(catchError(this.handleError),
      tap(resData=> {
        this.handleAuthentication(userName, userName, resData.token, 3600);
      })
  );
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(-1, email, userId, "", "", token, "", []);
    this.setToken(token);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private autoLogout(duration: number) {
    this.tokenExpirationTimer = setTimeout(()=> {
      this.logout();
    }, duration);
  }

  public logout(): void {
    this.user.next(new User(-1, "", "", "", "", "", "", []));
    this.router.navigate(['/home']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(()=> new Error(errorMessage));
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
    }
    return throwError(()=> new Error(errorMessage));
  }
}
