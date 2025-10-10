import { Component, inject } from "@angular/core";
import { MessageListComponent } from "./ui/message-list.component";
import { MessageService } from "../shared/data-access/message.service";


@Component({
  selector: 'app-home',
  template: `
    <div class="container">
      <app-message-list [messages]="messageService.messages()"/>
    </div>
  `,
  styles: ``,
  imports: [MessageListComponent]
})
export default class HomeComponent {
  messageService = inject(MessageService);
}
