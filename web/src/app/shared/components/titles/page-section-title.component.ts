import { Component, input } from '@angular/core';

@Component({
  selector: 'page-section-title',
  template: `
    <div
      class="border-b border-gray-300 pb-3 pl-3 pt-2 dark:border-gray-400"
      [class]="bgColor()"
      [style.margin-top.px]="marginTopPx()"
    >
      <h3
        class="text-base font-semibold leading-7 text-gray-900 dark:text-gray-300"
      >
        {{ title() }}
      </h3>
      <p class="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
        {{ description() }}
      </p>
    </div>
  `,
})
export class PageSectionTitleComponent {
  readonly marginTopPx = input<number>(0);
  readonly title = input<string>('');
  readonly description = input<string>('');
  readonly bgColor = input<string>('bg-zinc-100 dark:bg-zinc-700');
}
