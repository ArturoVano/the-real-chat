import { Component, effect, inject } from "@angular/core";
import { LoginFormComponent } from "./ui/login-form.component";
import { LoginService } from "./data-access/login.service";
import { Router, RouterModule } from "@angular/router";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { AuthService } from "../../shared/data-access/auth.service";

@Component({
  selector: 'app-login',
  template: `
    <div class="container gradient-bg">
      <app-login-form
        [status]="loginService.status()"
        (login)="loginService.login$.next($event)"
      />
      <a routerLink="/auth/register">Create account</a>
    </div>
  `,
 imports: [LoginFormComponent, RouterModule, MatProgressSpinnerModule],
 providers: [LoginService],
 styles: `
    a {
      margin: 2rem;
      color: var(--accent-darker-color);
    }
  `,
})
export default class LoginComponent {
  loginService = inject(LoginService);
  authService = inject(AuthService);
  router = inject(Router);

  constructor() {
    effect(() => {
      if (this.authService.user()) {
        this.router.navigate(['home']);
      }
    });
  }
}
