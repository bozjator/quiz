import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-icon-button',
  imports: [CommonModule, MatIconModule],
  template: `
    <button
      type="button"
      class="ripple group/icon-button inline-flex items-center justify-center rounded-full p-1.5 {{
        disabled() ? disableBgColor() : bgColor()
      }} {{ disabled() ? '' : bgColorHover() }}"
    >
      <mat-icon
        [class]="disabled() ? disableColor() : color()"
        [style.fontSize.px]="size()"
        [style.width.px]="size()"
        [style.height.px]="size()"
      >
        {{ icon() }}
      </mat-icon>
      @if (text().length > 0) {
        <span
          [ngClass]="{
            'hidden sm:inline': hideTextOnMobile(),
          }"
        >
          <p
            class="mx-1 pr-1 text-sm {{ color() }}"
            [ngClass]="{
              'hidden group-hover/icon-button:inline': showTextOnHover(),
            }"
          >
            {{ text() }}
          </p>
        </span>
      }
    </button>
  `,
})
export class IconButtonComponent {
  readonly disabled = input<boolean>(false);
  readonly text = input<string>('');
  readonly showTextOnHover = input<boolean>(true);
  readonly hideTextOnMobile = input<boolean>(false);
  readonly icon = input<string>('');
  readonly size = input<number>(16);
  readonly color = input<string>('text-blue-400');
  readonly disableColor = input<string>('text-gray-400');
  readonly bgColor = input<string>('');
  readonly bgColorHover = input<string>('hover:bg-blue-600/15 dark:hover:bg-blue-600/20');
  readonly disableBgColor = input<string>('text-gray-400');
}
