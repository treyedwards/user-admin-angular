import { Injectable } from '@angular/core';
import { User } from '../../model/User';
import { UserService } from './user.service';
import { map, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

interface UserResponse {
  email: string;
  firstName: string;
  id: number;
  lastName: string;
  name: string;
  password: string;
  roles?: string[];
};

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient, private userService: UserService, private authService: AuthService) { }

  getUsers() {

    return this.http
      .get<UserResponse[]>(
        'http://localhost:8080/auth/user/getAllUsers'
      )
      .pipe(
        map(users => {
          return users.map(user => {
            console.log("User User is: ", user);
            let newUser = new User(user.id, user.email, user.name, user.firstName, user.lastName, "", user.password, []);
            return {
              ...newUser
            };
          });
        }),
        tap(users => {
          this.userService.setUsers(users);
        })
      );
  }

  createUser(user: User) {
    return this.http.post('http://localhost:8080/auth/addNewUser', this.generateUpdateObject(user, "ROLE_ADMIN"));
  }

  updateUser(user: User) {
    return this.http.put('http://localhost:8080/auth/user/updateUser', this.generateUpdateObject(user, "ROLE_ADMIN"));
  }

  deleteUser(user: User) {
    console.log("Deleting user with ID: " + user.id);
    return this.http.put('http://localhost:8080/auth/user/deleteUser', this.generateUpdateObject(user, "ROLE_ADMIN"));
  }

  generateUpdateObject(user: User, roles: string): any {
    return {
      "id": user.id,
      "email": user.emailAddress,
      "firstName": user.firstName,
      "lastName": user.lastName,
      "name": user.userName,
      "password": user.password,
      "roles": roles
    };
  }
}
