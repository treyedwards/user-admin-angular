import { AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../shared/model/User';
import { DataService } from '../../shared/service/rest/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../shared/service/rest/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent implements OnInit, OnDestroy, AfterViewInit {

  userForm: FormGroup;

  forbiddenUserNames = ['suadmin'];
  forbiddenEmails = ['suadmin@suadmin.com'];

  isEdit: boolean = false;
  isNewUser: boolean = false;

  user: User | undefined;


  constructor(private fb: FormBuilder, private dataService: DataService, private userService: UserService, private route: ActivatedRoute, private router: Router) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        if (params['edit'] === "true") {
          this.user = this.userService.getEditUser();
          this.isEdit = true;
        }
        if (params['newUser'] === "true") {
          this.isNewUser = true;
        }
      }
      );
    this.userService.setIsEditing(true);
    this.userForm = new FormGroup({
      userData: new FormGroup({
        email: new FormControl(this.user?.emailAddress, [
          Validators.required, Validators.email,
          this.forbiddenUserName.bind(this)
        ]),
        firstName: new FormControl(this.user?.firstName, [
          Validators.required
        ]),
        lastName: new FormControl(this.user?.lastName, [
          Validators.required
        ]),
        userName: new FormControl(this.user?.userName, [
          Validators.required,
          this.forbiddenUserName.bind(this),
        ]),
        password: new FormControl(this.user?.password),
        confirmPassword: new FormControl(this.user?.password)
      })
    });
  }

  ngOnDestroy(): void {
    this.userService.setIsEditing(false);
  }

  onSubmit() {
    if (this.userForm.valid) {
      let user: User = new User(
        -1,
        this.userForm.value.userData.email,
        this.userForm.value.userData.userName,
        this.userForm.value.userData.firstName,
        this.userForm.value.userData.lastName,
        "",
        this.userForm.value.userData.password,
        []);
    } else {
      alert('Please correct the form and try again!');
    }

  }

  onClearForm() {
    this.userForm.reset();
  }

  onUpdateUser() {
    //if (this.userForm.valid) {
      let user: User = new User(
        this.user?.id ? this.user.id : -1,
        this.userForm.value.userData.email,
        this.userForm.value.userData.userName,
        this.userForm.value.userData.firstName,
        this.userForm.value.userData.lastName,
        "",
        this.userForm.value.userData.password,
        []);
      this.dataService.updateUser(user).subscribe({
        next: () => {
          alert("Update successful!");
          this.router.navigate(["/search"]);
        },
        error(errorMessage) {
          if (errorMessage) {
            alert("Error updating resource.");
          }
        }
      });
    //} else {
      //alert('Please correct form before submission!');
    //}
  }

  onDeleteUser() {

    let user: User = new User(
      this.user?.id ? this.user.id : -1,
      this.userForm.value.userData.email,
      this.userForm.value.userData.userName,
      this.userForm.value.userData.firstName,
      this.userForm.value.userData.lastName,
      "",
      this.userForm.value.userData.password,
      []);

    let canDelete: boolean = false;

    if (confirm("Delete user with ID: " + user.id + "?") == true) {
      this.dataService.deleteUser(user).subscribe(() => {
        next: {
          alert("Delete Successful!");
          this.router.navigate(["/search"]);
        }
        error: {
          //alert("Error deleting resource.");
        }
      });
    }
  }

  onCreateNew() {
    let user: User = new User(
      -1,
      this.userForm.value.userData.email,
      this.userForm.value.userData.userName,
      this.userForm.value.userData.firstName,
      this.userForm.value.userData.lastName,
      "",
      this.userForm.value.userData.password,
      []);
    this.dataService.createUser(user).subscribe(() => {
      next: {
        alert("New User Created!");
        this.router.navigate(["/search"]);
      }
    });
  }

  onCancel() {
    if (this.userService.getEditUser() !== null) {
      this.userService.setEditUser(undefined);
    }
    this.router.navigate(["/search"]);
  }

  forbiddenUserName(control: FormControl): { [s: string]: boolean } | null {
    if (this.forbiddenUserNames.indexOf(control.value) !== -1) {
      return { nameIsForbidden: true };
    }
    return null;
  }

  forbiddenEmail(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        if (this.forbiddenEmails.indexOf(control.value)) {
          resolve({ emailIsForbidden: true });
        } else {
          resolve(null);
        }
      }, 1500);
    });
    return promise;
  }
}
