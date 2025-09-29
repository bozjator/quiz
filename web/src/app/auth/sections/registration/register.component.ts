import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { firstValueFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthPageLayoutComponent } from '../auth-page-layout.component';
import { AuthApiService } from '../../../shared/services/api/auth-api.service';
import { AlertComponent } from '../../../shared/components/alert.component';
import { LoginCredentials, RegisterUser } from '../../models/auth.models';
import { SharedFunctionsService } from '../../../shared/services/shared-functions.service';
import { AppState } from '../../../shared/store/app-store';
import { AuthActions } from '../../store/auth.actions';
import { INPUT_LENGTHS } from '../../../app.config';
import { AuthSelectors } from '../../store/auth.selectors';

interface RegistrationForm {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  agreedToTerms: FormControl<boolean | null>;
}

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    AuthPageLayoutComponent,
    AlertComponent,
  ],
})
export class RegisterComponent implements OnInit {
  private router = inject(Router);
  private store = inject<Store<AppState>>(Store);
  private formBuilder = inject(FormBuilder);
  private authApiService = inject(AuthApiService);
  private sharedFn = inject(SharedFunctionsService);

  registerForm!: FormGroup<RegistrationForm>;
  apiCallInProgress: boolean = false;
  registerSuccess: boolean = false;
  errorMsg: string = '';
  errorMsgFromApi: string = '';

  constructor() {
    this.setupRegisterForm();
  }

  async ngOnInit(): Promise<void> {
    this.checkIfAlreadyLoggedIn();
  }

  private async checkIfAlreadyLoggedIn(): Promise<void> {
    const loggedIn = await firstValueFrom(this.store.select(AuthSelectors.isLoggedIn));
    if (loggedIn) this.router.navigateByUrl('');
  }

  private setupRegisterForm() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(INPUT_LENGTHS.max.firstName)]],
      lastName: ['', [Validators.required, Validators.maxLength(INPUT_LENGTHS.max.lastName)]],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(INPUT_LENGTHS.max.email)],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(INPUT_LENGTHS.min.password),
          Validators.maxLength(INPUT_LENGTHS.max.password),
        ],
      ],
      agreedToTerms: [false, [Validators.required]],
    });
  }

  private login = () => {
    const loginData: LoginCredentials = {
      email: this.registerForm.value.email ?? '',
      password: this.registerForm.value.password ?? '',
    };
    this.store.dispatch(AuthActions.login({ payload: loginData }));
  };

  register() {
    this.apiCallInProgress = true;
    this.errorMsg = '';

    const formValues = this.registerForm.value;

    const registration: RegisterUser = {
      firstName: formValues.firstName ?? '',
      lastName: formValues.lastName ?? '',
      email: formValues.email ?? '',
      password: formValues.password ?? '',
    };

    this.authApiService.register(registration).subscribe({
      next: (_) => {
        this.registerSuccess = true;
        setTimeout(this.login, 3000);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.Conflict) {
          this.errorMsg = 'Account with given email already exists';
        } else {
          this.errorMsg = 'Error creating your account';
          this.errorMsgFromApi = this.sharedFn.getHttpErrorMessages(error);
        }
        this.apiCallInProgress = false;
      },
    });
  }
}
