import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-icon-button-small',
  imports: [MatIconModule],
  template: `
    <div
      class="ripple inline-flex cursor-pointer items-center justify-center rounded-full bg-transparent transition-colors duration-300 hover:bg-blue-600/15 dark:hover:bg-blue-600/30"
    >
      <mat-icon
        [class]="color()"
        [style.fontSize.px]="size()"
        [style.width.px]="size()"
        [style.height.px]="size()"
      >
        {{ icon() }}
      </mat-icon>
    </div>
  `,
})
export class IconButtonSmallComponent {
  readonly icon = input<string>('');
  readonly size = input<number>(20);
  readonly color = input<string>('text-stone-600');
}
