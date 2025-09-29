import { ChangeDetectionStrategy, Component, ElementRef, output, viewChild } from '@angular/core';
import { AlertComponent, AlertType } from '../../alert.component';
import { IconButtonComponent } from '../../buttons/icon-button.component';

@Component({
  selector: 'app-notification',
  template: `
    <div #notificationDiv class="notification flex flex-col items-center lg:animate-bounce">
      <div class="flex w-full items-center justify-between">
        <span class="pl-1 text-center text-sm">{{ title }}</span>
        <app-icon-button [icon]="'close'" (click)="close.emit()" class="-mr-1" />
      </div>
      <app-alert
        visible
        [showEdgeBorders]="false"
        [message]="message"
        [type]="type"
        [class]="'p-6'"
        class="w-full"
      />
    </div>
  `,
  imports: [AlertComponent, IconButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
  title: string = 'Info';
  message: string = '';
  type: AlertType = AlertType.gray;
  readonly close = output<void>();

  readonly notificationDiv = viewChild.required<ElementRef<HTMLDivElement>>('notificationDiv');

  removeAnimation() {
    this.notificationDiv().nativeElement.classList.remove('lg:animate-bounce');
  }
}
