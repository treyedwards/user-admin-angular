import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { User } from '../../shared/model/User';
import { DataService } from '../../shared/service/rest/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../shared/service/rest/user.service';
import { AuthService } from '../../shared/service/rest/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('userForm', { static: true }) public userForm: NgForm | undefined;

  user: User | undefined;

  forbiddenUserNames = ['suadmin'];
  forbiddenEmails = ['suadmin@suadmin.com'];

  signupForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dataService: DataService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router) {
    this.signupForm = this.fb.group({
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
    this.signupForm = new FormGroup({
      userData: new FormGroup({
        email: new FormControl(null, [
          Validators.required, Validators.email,
          this.forbiddenUserName.bind(this)
        ]),
        firstName: new FormControl(null, [
          Validators.required
        ]),
        lastName: new FormControl(null, [
          Validators.required
        ]),
        userName: new FormControl(null, [
          Validators.required,
          this.forbiddenUserName.bind(this),
        ]),
        password: new FormControl(null, [
          Validators.required
        ]),
        confirmPassword: new FormControl(null, [
          Validators.required
        ])
      })
    });
  }

  ngOnDestroy(): void {
  }

  onSubmit() {
    if (this.signupForm.valid) {
      let user: User = new User(
        -1,
        this.signupForm.value.userData.email,
        this.signupForm.value.userData.userName,
        this.signupForm.value.userData.firstName,
        this.signupForm.value.userData.lastName,
        "",
        this.signupForm.value.userData.password,
        []);
      this.dataService.createUser(user).subscribe(() => {
        next: {
          alert("New User Created!");
          console.log("Autologging in new user: " + user.userName + ", with password: " + user.password);
          this.authService.login(user.userName, user.password).subscribe(() => {
            next: {
              console.log('Logged user in from sign-up');
              this.router.navigate(["/home"]);
            }
            error: {
              console.log("ERROR FROM LOGIN");
            }
          });
        }
      });
    } else {
      alert('Please correct the form and try again!');
    }
  }

  onClearForm() {
    this.signupForm.reset();
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
