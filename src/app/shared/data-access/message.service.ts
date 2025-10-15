import { computed, inject, Injectable, signal } from "@angular/core";
import { Message } from "../interfaces/message";
import { connect } from 'ngxtension/connect';
import { catchError, defer, exhaustMap, filter, ignoreElements, map, merge, Observable, of, retry, Subject, tap } from "rxjs";
import { toObservable } from "@angular/core/rxjs-interop";
import { addDoc, collection, limit, orderBy, query } from "firebase/firestore";
import { FIRESTORE } from "../../app.config";
import { collectionData } from 'rxfire/firestore';
import { AuthService } from "./auth.service";

interface MessageState {
  messages: Message[];
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private firestore = inject(FIRESTORE);
  private authService = inject(AuthService);

  // sources
  private authUser$ = toObservable(this.authService.user);
  messages$ = this.getMessages().pipe(
    // restart stream when user reauthenticates
    retry({
      delay: () => this.authUser$.pipe(filter((user) => !!user))
    })
  );
  add$ = new Subject<Message['content']>();

  // state
  private state = signal<MessageState>({
    messages: [],
    error: null,
  });

  // selectors
  messages = computed(() => this.state().messages);
  error = computed(() => this.state().error);

  constructor() {
    // reducers
    const nextState$ = merge(
      this.messages$.pipe(
        tap((messages) => {
          const mensaje = messages;
          console.log({ messages })
        }),
        map((messages) => ({ messages }))
      ),
      this.add$.pipe(
        tap((message) => console.log('message en add$', message)),
        exhaustMap((message) => this.addMessage(message)),
        ignoreElements(),
        catchError((error) => of ({ error }))
      )
    );

    connect(this.state).with(nextState$);
  }

  private getMessages() {
    const messagesCollection = query(
      collection(this.firestore, 'messages'),
      orderBy('created', 'desc'),
      limit(50)
    );
    // idField get the unique id of the documents, and reverse invert the order
    return collectionData(messagesCollection, {idField: 'id'}).pipe(
      map((messages) => [...messages].reverse()),
      catchError(() => {
        return of([]);
      })
    ) as Observable<any[]>;
  }

  private addMessage(message: string) {
    const newMessage = {
      author: this.authService.user()?.email,
      content: message,
      created: Date.now().toString(),
    }

    const messagesCollection = collection(this.firestore, 'messages');
    return defer(() => addDoc(messagesCollection, newMessage));
  }
}
