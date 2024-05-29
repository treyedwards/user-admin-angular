import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../shared/service/rest/auth.service';
import { User } from '../../shared/model/User';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {

  isLoggedIn: boolean = false;
  private userSubscription: Subscription | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
      this.userSubscription = this.authService.user.subscribe({
        next: (userData: User) => {
          this.isLoggedIn = userData.token!=undefined && userData.token.length > 0;
        }
      });
  }

  ngOnDestroy(): void {
     if (this.userSubscription)  {
      this.userSubscription.unsubscribe();
     }
  }

  onLogout(): void {
    this.authService.logout();
  }
}
