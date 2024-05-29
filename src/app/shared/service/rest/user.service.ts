import { Injectable } from '@angular/core';
import { User } from '../../model/User';
import { Subject } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  usersChanged = new Subject<User[]>();
  isEditingSubject = new Subject<boolean>();

  allUsers: User[] = [];
  users: User[] = [];

  editUser: User | undefined;

  constructor() {
  }

  public setUsers(users: User[]) {
    this.allUsers = this.users = users;
    this.usersChanged.next(this.users.slice());
  }

  public getUsers(): User[] {
    return this.users.slice();
  }

  setEditUser(user: User | undefined) {
    this.editUser = user;
  }

  setIsEditing(value: boolean) {
    this.isEditingSubject.next(value);
  }

  getEditUser(): User | undefined {
    return this.editUser;
  }

  setSearchValues(userData: User) {
    if (this.isUserEmpty(userData)) {
      this.users = this.allUsers;
      this.usersChanged.next(this.users);
    } else {
      this.users = this.filterUsers(userData);
      this.usersChanged.next(this.users.slice());
    }
  }

  filterUsers(userData: User): User[] {
    return this.filterArray(this.allUsers, (user) => { return this.hasMatch(userData, user) });
  }

  filterArray(array: any[], callback: (element: any) => boolean): any[] {
    const filteredArray = [];
    for (const element of array) {
      if (callback(element)) {
        filteredArray.push(element);
      }
    }
    return filteredArray;
  }

  hasMatch(user1: any, user2: any): boolean {
    let matched: boolean = false;
    if (user1 && user2) {
      matched = this.hasFieldMatch(user1.userData.email, user2.emailAddress)
        || this.hasFieldMatch(user1.userData.firstName, user2.firstName)
        || this.hasFieldMatch(user1.userData.lastName, user2.lastName)
        || this.hasFieldMatch(user1.userData.userName, user2.userName)
    }
    return matched;
  }

  hasFieldMatch(field1: string, field2: string): boolean {
    let value: boolean = field1 !== null && field2 !== null && field1.length > 0 && field2.length > 0 && field2.toLowerCase().indexOf(field1.toLowerCase()) >= 0;
    return value;
  }

  isUserEmpty(userData: any): boolean {
    return userData.userData == null || (
      (userData.userData.email === null || userData.userData.email.length <= 0)
      && (userData.userData.firstName === null || userData.userData.firstName.length <= 0)
      && (userData.userData.lastName === null || userData.userData.lastName.length <= 0)
      && (userData.userData.userName === null || userData.userData.userName.length <= 0)
    );
  }
}
