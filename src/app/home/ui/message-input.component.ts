import { Component, output } from "@angular/core";
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-message-input',
  template: `
    <form class="message-input__wrapper">
      <input
        type="text"
        placeholder="Write your message..."
        [formControl]="messageControl"
      >
      <button
        (click)="
          send.emit(messageControl.value);
          messageControl.reset()
        "
        type="submit"
        class="message-input__btn"
      >
        <mat-icon>send</mat-icon>
      </button>
    </form>
  `,
  styles: `
    .message-input {
      &__wrapper {
        width: 100%;
        position: relative;
        display: flex;
        gap: 5px;
      }

      input {
        width: 100%;
        background: var(--white);
        border: none;
        font-size: 1.2em;
        padding: 2rem 1rem;
      }

      &__btn {
        background-color: #1899D6;
        border: 16px solid transparent;
        border-width: 0 0 4px;
        color: #FFFFFF;
        font-size: 15px;
        font-weight: 700;
        padding: 4px;

        &:hover {
          filter: brightness(1.1);
          -webkit-filter: brightness(1.1);
        }

        mat-icon {
          margin-right: 0;
        }
      }
    }
  `,
  imports: [ReactiveFormsModule, MatIconModule]
})
export class MessageInputComponent {
  messageControl = new FormControl();
  send = output<string>();
}
