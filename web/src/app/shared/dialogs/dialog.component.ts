import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog',
  imports: [CommonModule],
  template: `
    <div class="flex h-full max-h-[90vh] flex-col bg-zinc-100 dark:bg-zinc-500">
      <!-- Header Section (Sticky Top) -->
      <div class="flex-shrink-0 p-4 pb-2">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div
              class="w-full border-t border-gray-600 dark:border-gray-200"
            ></div>
          </div>
          <div class="relative flex justify-start">
            <span
              class="bg-zinc-100 pr-3 text-base font-semibold leading-6 text-gray-600 dark:bg-zinc-500 dark:text-gray-200"
            >
              {{ title() }}
            </span>
          </div>
        </div>
        <ng-content select="[sticky-top]"></ng-content>
      </div>

      <!-- Scrollable Content Section -->
      <div
        class="flex-grow overflow-y-auto overflow-x-hidden"
        [ngClass]="{
          'p-4 pt-2': mainContentAddPadding(),
        }"
      >
        <ng-content></ng-content>
      </div>

      <!-- Footer Section (Sticky Bottom) -->
      <div class="flex-shrink-0 bg-zinc-200 p-2 dark:bg-zinc-400">
        <ng-content select="[sticky-bottom]"></ng-content>
        <div class="flex items-center justify-between">
          <div class="flex space-x-3">
            <ng-content select="[footer-start]"></ng-content>
          </div>
          <div class="flex space-x-3">
            <ng-content select="[footer]"></ng-content>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DialogComponent {
  readonly title = input<string>('');
  readonly mainContentAddPadding = input(true);
}
