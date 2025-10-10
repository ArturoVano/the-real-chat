import { computed, inject, Injectable, signal } from "@angular/core";
import { Message } from "../interfaces/message";
import { FIRESTORE } from "../../app.config";
import { connect } from 'ngxtension/connect';
import { catchError, map, merge, Observable, of, tap } from "rxjs";
import { collection, limit, orderBy, query } from "firebase/firestore";
import { collectionData } from 'rxfire/firestore';

interface MessageState {
  messages: Message[];
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private firestore = inject(FIRESTORE);

  // sources
  messages$ = this.getMessages();

  // state
  private state = signal<MessageState>({
    messages: [],
    error: null,
  });

  // selectors
  messages = computed(() => this.state().messages);
  error = computed(() => this.state().error);

  constuctor() {
    // reducers
    console.log('constructor del message service')
    this.messages$.subscribe(messages => {
      console.log('Mensajes: ', messages)
    })
    const nextState$ = merge(
      this.messages$.pipe(map((messages) => ({ messages })))
    );
    connect(this.state).with(nextState$);
    console.log('Fin del constructor')
  }

  private getMessages() {
    console.log('firestore service:', this.firestore);
    const messagesCollection = query(
      collection(this.firestore, 'messages'),
      orderBy('created', 'desc'),
      limit(50)
    );
    // idField get the unique id of the documents, and reverse invert the order
    return collectionData(messagesCollection, {idField: 'id'}).pipe(
      tap(msgs => console.log('collectionData emitted (raw):', msgs)),
      map((messages) => [...messages].reverse()),
      catchError(err => {
        console.error('collectionData error:', err);
        return of([]); // evita que la suscripción se rompa
      })
    ) as Observable<any[]>;
  }

  private addMessage(message: string) {
    const newMessage: Message = {
      author: 'me@test.com',
      content: message,
      created: Date.now().toString(),
    }
  }
}
