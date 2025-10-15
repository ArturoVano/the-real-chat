import { Component, inject, input, output } from "@angular/core";
import { LoginStatus } from "../data-access/login.service";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Credentials } from "../../../shared/interfaces/credentials";


@Component({
  selector: 'app-login-form',
  template: `
   <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" #form="ngForm">
      <mat-form-field appearance="fill">
        <mat-label>email</mat-label>
        <input
          matNativeControl
          formControlName="email"
          type="email"
          placeholder="email"
        />
        <mat-icon matPrefix>email</mat-icon>
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>password</mat-label>
        <input
          matNativeControl
          formControlName="password"
          data-test="create-password-field"
          type="password"
          placeholder="password"
        />
        <mat-icon matPrefix>lock</mat-icon>
      </mat-form-field>

      @if (status() === 'error') {
        <mat-error>Could not log you in with those details.</mat-error>
      } @else if (status() === 'authenticating') {
        <mat-spinner diameter="50"></mat-spinner>
      }

      <button
        mat-raised-button
        class="accent"
        type="submit"
        [disabled]="status() === 'authenticating'"
      >
        Login
      </button>
    </form>
    `,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  styles: [
    `
      form {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      button {
        width: 100%;
      }

      mat-error {
        margin: 5px 0;
      }

      mat-spinner {
        margin: 1rem 0;
      }
    `,
  ],
})
export class LoginFormComponent {
  status = input.required<LoginStatus>();
  login = output<Credentials>();

  private fb = inject(FormBuilder);

  loginForm = this.fb.group({
    email: [''],
    password: [''],
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.login.emit((this.loginForm.getRawValue() as Credentials));
    }
  }
}
