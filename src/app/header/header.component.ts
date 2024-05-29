import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../shared/service/rest/auth.service';
import { Subscription } from 'rxjs';
import { User } from '../shared/model/User';
import { UserService } from '../shared/service/rest/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {

  isLoggedIn: boolean = false;
  isEditing: boolean = false;

  private userSubscription: Subscription | undefined;
  private isEditingSubscription: Subscription | undefined;

  constructor(private authService: AuthService, private userService: UserService) {}

  ngOnInit(): void {
      this.userSubscription = this.authService.user.subscribe({
        next: (userData: User) => {
          this.isLoggedIn = userData.token!=undefined && userData.token.length > 0;
        }
      });
      this.isEditingSubscription = this.userService.isEditingSubject.subscribe({
        next: (isEditing: boolean) => {
          this.isEditing = isEditing;
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
