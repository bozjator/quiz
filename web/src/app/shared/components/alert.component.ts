import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export enum AlertType {
  /** Error */
  red = 'red',

  /** Warning */
  yellow = 'yellow',

  /** Information */
  blue = 'blue',

  /** Success */
  green = 'green',

  /** Neutral or System message */
  gray = 'gray',
}

@Component({
  selector: 'app-alert',
  imports: [CommonModule, MatIconModule],
  template: `
    @if (visible()) {
      <div
        class="flex items-center justify-center rounded-sm text-center text-sm {{ class() }}"
        [ngClass]="{
          'bg-green-200 text-green-700': type() === alertTypeEnum.green,
          'bg-sky-200 text-sky-700': type() === alertTypeEnum.blue,
          'bg-stone-200 text-stone-700': type() === alertTypeEnum.gray,
          'bg-yellow-50 text-yellow-700': type() === alertTypeEnum.yellow,
          'bg-red-50 text-red-700': type() === alertTypeEnum.red,
          'border-l-4 border-r-4': showEdgeBorders(),
          'border-green-400': showEdgeBorders() && type() === alertTypeEnum.green,
          'border-sky-400': showEdgeBorders() && type() === alertTypeEnum.blue,
          'border-stone-400': showEdgeBorders() && type() === alertTypeEnum.gray,
          'border-yellow-400': showEdgeBorders() && type() === alertTypeEnum.yellow,
          'border-red-400': showEdgeBorders() && type() === alertTypeEnum.red,
        }"
      >
        @if (messageOnHover().length > 0) {
          <mat-icon
            [attr.title]="messageOnHover()"
            class="mr-2"
            [ngClass]="{
              'text-green-700': type() === alertTypeEnum.green,
              'text-sky-700': type() === alertTypeEnum.blue,
              'text-stone-700': type() === alertTypeEnum.gray,
              'text-yellow-700': type() === alertTypeEnum.yellow,
              'text-red-700': type() === alertTypeEnum.red,
            }"
            [style.fontSize.px]="16"
            [style.width.px]="16"
            [style.height.px]="16"
          >
            info
          </mat-icon>
        }
        {{ message() }}
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  alertTypeEnum: any = AlertType;

  readonly visible = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  readonly showEdgeBorders = input<boolean>(true);
  readonly type = input<AlertType | string>(AlertType.gray);
  readonly message = input<string>('');
  readonly messageOnHover = input<string>('');
  readonly class = input<string>('p-2');
}
