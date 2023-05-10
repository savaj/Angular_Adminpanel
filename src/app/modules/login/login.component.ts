import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalService } from 'src/app/services/local.service';
import { UserService } from 'src/app/services/user.service';

// Create observer object
var myObserver = {
  next: (response: any) => console.log(response),
  error: (err: Error) => console.error('Error: ' + err),
  complete: () => console.log('Completed'),
  submitted: () => true
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  num1!: number;
  num2!: number;
  operator!: string;
  answer!: number;
  captchaValid!: boolean;

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    captcha: new FormControl('')

  });
  base_url = 'users/';
  login_url = 'login';
  submitted = false;

  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private localStore: LocalService,
    private router: Router,
    private toastr: ToastrService) {
    this.generateCaptcha();
  }

  ngOnInit(): void {

    this.loginForm = this.formBuilder.group(
      {
        email: ['', [Validators.required]],
        password: ['', Validators.required],
        captcha: ['', [Validators.required]]
      },
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  generateCaptcha() {
    this.num1 = Math.floor(Math.random() * 10) + 1;
    this.num2 = Math.floor(Math.random() * 10) + 1;
    const operators = ['+', '-', '*'];
    this.operator = operators[Math.floor(Math.random() * operators.length)];

    switch (this.operator) {
      case '+':
        this.answer = this.num1 + this.num2;
        break;
      case '-':
        this.answer = this.num1 - this.num2;
        break;
      case '*':
        this.answer = this.num1 * this.num2;
        break;
    }
  }

  onSubmit(): void {
    try {
      this.submitted = true;
      if (this.loginForm.invalid) {
        return;
      } else {
        if (this.answer === +this.loginForm.value.captcha && this.loginForm.valid) {
          this.captchaValid = true;
          const loginRes = { username: '', password: '' };
          const common_mail_extension = '@gujarat.gov.in';
          if (this.loginForm.value.email.includes(common_mail_extension)) {
            loginRes.username = `${this.loginForm.value.email}`
          } else {
            loginRes.username = `${this.loginForm.value.email}${common_mail_extension}`;
          }
          loginRes.password = this.loginForm.value.password;
          this.userService.create(`${this.base_url}${this.login_url}`, loginRes).subscribe({
            next: (response: any) => {
              const responseData = response["data"];
              const authRes = responseData.auth;
              var submitted = authRes.AuthenticateResult === true ? true : false;
              if (submitted === true) {
                this.localStore.saveData("token", responseData.token);
                this.toastr.success('Login successfully');
                this.router.navigate(["/main/dashboard"]);
              } else {
                this.toastr.error('No such username or password');
              }
            },
            error: (err: any) => {
              this.toastr.error(err.error.message);
            },
            complete: () => console.log('completed')
          });
        } else {
          this.captchaValid = false;
          this.generateCaptcha();
          this.toastr.error('Invalid captcha. Please try again.');
        }
      }
    } catch (error: any) {
      this.toastr.error(error.message);
    }
  }

  onReset(): void {
    this.submitted = false;
    this.loginForm.reset();
  }

}
