import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Title } from '@angular/platform-browser';
import { UserService } from './user.service';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth.component.html',
  styleUrls:['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  hide = true;
  authType: String = 'login';
  title: String = '';
  errors: [] ;
  isSubmitting = false;
  authForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private titleService:Title
  ) {
   
  }

  ngOnInit() {
    this.route.url.subscribe(data => {
      // Get the last piece of the URL (it's either 'login' or 'register')
      this.authType = data[data.length - 1].path;
      // Set a title for the page accordingly
      this.title = (this.authType === 'login') ? 'Sign in' : 'Sign up';
      // add form control for username if this is the register page
      this.titleService.setTitle("Intializer | "+this.authType);

       // use FormBuilder to create a form group
    if (this.authType === 'register') {
      this.authForm = this.fb.group({
        'email': ['', Validators.required],
        'username': ['', Validators.required],
        'name': ['', Validators.required],
        'password': ['', Validators.required]
      });
    }
    else if(this.authType === 'login'){
    this.authForm = this.fb.group({
      'usernameOrEmail': ['', Validators.required],
      'password': ['', Validators.required]
     });
    }

      if (this.authType === 'register') {
        this.authForm.addControl('username', new FormControl());
        this.authForm.addControl('name', new FormControl());
        this.authForm.addControl('email', new FormControl());
      }
    });
  }

  submitForm() {
    this.isSubmitting = true;

    const credentials = this.authForm.value;
    this.userService
    .attemptAuth(this.authType, credentials)
    .subscribe(
      data => this.router.navigateByUrl('/'),
      err => {
        this.errors = err.errors;
        this.isSubmitting = false;
      }
    );
  }
}
