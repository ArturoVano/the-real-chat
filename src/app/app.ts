import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from './shared/data-access/message.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  styles: [],
})
export class App {
  messageService = inject(MessageService);
}
