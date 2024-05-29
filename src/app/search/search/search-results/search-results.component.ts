import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '../../../shared/service/rest/data.service';
import { Subscription } from 'rxjs';
import { UserService } from '../../../shared/service/rest/user.service';
import { User } from '../../../shared/model/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent implements OnInit, OnDestroy {

  userSubscription: Subscription | undefined;
  users: User[] | undefined;

  constructor(private userService: UserService, private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.dataService.getUsers().subscribe();
    this.userSubscription = this.userService.usersChanged.subscribe((users: User[]) => {
      this.users = users;
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  onItemEdit(user: User) {
    this.userService.setEditUser(user);
    this.router.navigate(['/edit'],
      { queryParams: { edit: 'true' }}
    );
  }
}
