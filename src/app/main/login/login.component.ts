import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { UtilsService } from '../../shared/services/utils.service';
import { ApiService } from './../../shared/services/api.service';
import { JwtService } from './../../shared/services/auth/jwt.service';
import { UserService } from './../../shared/services/auth/user.service';


class AuthenticationRequest {
  username: string;
  password: string;
}


@Component({
  selector: 'app-inma-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService, ApiService, JwtService]
})
export class LoginComponent {
  
  hide = true;
  title: String = '';
  errors: [];
  isSubmitting = false;
  authForm: FormGroup;
  selectedLang: string = 'ar';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private alertService: AlertService,
    private utilService: UtilsService
  ) {
    this.utilService.setDocTitle('form.button.login', true);
    this.selectedLang = this.utilService.getCurrentLang();
  }

  ngOnInit() {
    this.authForm = this.fb.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required]
    });
  }

  submitForm() {
    this.isSubmitting = true;

    const credentials = this.authForm.value;
    this.userService
      .attemptAuth('login', credentials)
      .subscribe(
        data => {
          this.utilService.setDocTitle('dashboard.title', false);
          this.router.navigateByUrl('/dashboard');
        },
        err => {
          console.log(err);
          this.alertService.error(err.message);
          this.errors = err;
          this.isSubmitting = false;
        }
      );


  }

  switchLang() {

    this.selectedLang = this.utilService.getCurrentLang();

    if (this.selectedLang == "ar")

      this.selectedLang = this.utilService.setLang("en");

    else if (this.selectedLang == "en")

      this.selectedLang = this.utilService.setLang("ar");

  }

}
