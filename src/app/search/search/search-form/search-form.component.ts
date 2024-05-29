import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, startWith } from 'rxjs';
import { UserService } from '../../../shared/service/rest/user.service';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss'
})
export class SearchFormComponent implements OnInit, OnDestroy {

  searchForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService, private router:Router){
    this.searchForm = this.fb.group({
      email: [''],
      firstName: [''],
      lastName: [''],
      userName: ['']
    });
  }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      userData: new FormGroup({
        email: new FormControl(null),
        firstName: new FormControl(null),
        lastName: new FormControl(null),
        userName: new FormControl(null)
      })
    });
    this.searchForm.valueChanges.subscribe((value)=> {
      this.userService.setSearchValues(value);
    });
  }

  ngOnDestroy(): void {
  }

  onSubmit() {
    if (this.searchForm.valid) {

    } else {

    }
  }

  onClearForm() {
    this.searchForm.reset();
  }

  onAddUser() {
    this.router.navigate([])
    this.router.navigate(['/edit'],
    { queryParams: { newUser: 'true' }}
  );
  }

}
