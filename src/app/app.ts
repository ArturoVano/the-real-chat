import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from './shared/data-access/message.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  styles: [],
})
export class App {
  messageService = inject(MessageService);

  constructor() {
    this.messageService.messages$.pipe(takeUntilDestroyed()).subscribe((messages) => {
      console.log('mensajes: ', messages)
    })
  }
}
