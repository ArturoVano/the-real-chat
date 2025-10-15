import { computed, inject, Injectable, signal } from "@angular/core";
import { AuthService } from "../../../shared/data-access/auth.service";
import { catchError, EMPTY, map, merge, Subject, switchMap } from "rxjs";
import { Credentials } from "../../../shared/interfaces/credentials";
import { connect } from "ngxtension/connect";

export type LoginStatus = 'pending' | 'authenticating' | 'success' | 'error';

interface LoginState {
  status: LoginStatus
}

@Injectable()
export class LoginService {
  private authService = inject(AuthService);

  private state = signal<LoginState>({
    status: 'pending'
  });

  status = computed(() => this.state().status);

  error$ = new Subject<void>();
  login$ = new Subject<Credentials>();
  loged$ = this.login$.pipe(switchMap((credentials) =>
    this.authService.login(credentials).pipe(
      catchError(() => {
        this.error$.next();
        return EMPTY;
      })
    )
  ));

  constructor() {
    const nextState$ = merge(
      this.error$.pipe(map(() => ({ status: 'error' as const }))),
      this.login$.pipe(map(() => ({ status: 'authenticating' as const }))),
      this.loged$.pipe(map(() => ({ status: 'success' as const }))),
    );

    connect(this.state).with(nextState$);
  }
}
