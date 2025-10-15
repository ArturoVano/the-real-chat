import { computed, inject, Injectable, signal } from "@angular/core";
import { AuthService } from "../../../shared/data-access/auth.service";
import { catchError, EMPTY, map, merge, Subject, switchMap } from "rxjs";
import { Credentials } from "../../../shared/interfaces/credentials";
import { connect } from "ngxtension/connect";


export type RegisterStatus = 'pending' | 'creating' | 'complete' | 'error';

interface RegisterState {
  status: RegisterStatus;
}

@Injectable()
export class RegisterService {
  private authService = inject(AuthService);

  private state = signal<RegisterState>({
    status: 'pending'
  });

  status = computed(() => this.state().status);

  // sources
  error$ = new Subject<void>();
  createUser$ = new Subject<Credentials>();
  userCreated$ = this.createUser$.pipe(
    switchMap((credentials) =>
      this.authService.createAccount(credentials).pipe(
        catchError(() => {
          this.error$.next()
          return EMPTY;
        })
      )
    )
  );

  constructor() {
    const nextState$ = merge(
      this.userCreated$.pipe(map(() => ({ status: 'creating' as const }))),
      this.createUser$.pipe(map(() => ({ status: 'complete' as const }))),
      this.error$.pipe(map(() => ({ status: 'error' as const }))),
    );

    connect(this.state).with(nextState$);
  }
}
