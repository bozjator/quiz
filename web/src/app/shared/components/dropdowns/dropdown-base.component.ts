import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dropdown-base',
  template: `
    <div
      class="h-[45px] min-w-14 cursor-pointer bg-blue-500 px-4 transition-colors duration-300 hover:bg-blue-600 sm:min-w-40"
      [ngClass]="{
        'rounded-full': !dropdownOpen(),
        'rounded-r-full rounded-t-full rounded-bl-none': dropdownOpen(),
      }"
      (click)="onClickDropdownBase()"
    >
      <div class="text-center text-xs text-white">
        <div class="hidden pt-1.5 sm:block">{{ title() }}</div>
        <div class="block pt-1.5 sm:hidden">{{ titleOnMobile() }}</div>
        <div class="hidden max-w-[240px] truncate whitespace-nowrap sm:block">
          {{ selectionText() }}
        </div>
        <div class="block whitespace-nowrap sm:hidden">
          {{ selectionTextOnMobile() }}
        </div>
      </div>

      <div class="relative">
        @if (dropdownOpen()) {
          <div
            #dropdownElement
            class="absolute -left-4 top-[6px] overflow-auto rounded-md border border-blue-300 bg-zinc-50 p-2 shadow-md dark:text-neutral-700"
            [ngClass]="{
              'rounded-tl-none': dropdownOpen() && !offsetActive(),
            }"
            (click)="$event.stopPropagation()"
          >
            <ng-content></ng-content>

            <div class="flex justify-end space-x-1">
              <button class="app-btn-sec" (click)="onClickCancel(); $event.stopPropagation()">
                Cancel
              </button>
              <button class="app-btn" (click)="onClickApply(); $event.stopPropagation()">
                Apply
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownBaseComponent {
  readonly title = input.required<string>();
  readonly titleOnMobile = input.required<string>();
  readonly selectionText = input.required<string>();
  readonly selectionTextOnMobile = input.required<string>();
  readonly onApply = output<boolean>();
  readonly onCancel = output<boolean>();

  dropdownElement = viewChild<ElementRef>('dropdownElement');

  dropdownOpen = signal(false);
  offsetActive = signal(false);

  constructor() {
    effect(() => {
      if (this.dropdownOpen()) this.checkForOverflowRightEdge();
    });
  }

  private onCloseDropdown(): void {
    this.dropdownOpen.set(false);
  }

  private checkForOverflowRightEdge(): void {
    const dropdown = this.dropdownElement();
    if (!dropdown) return;

    const rect = dropdown.nativeElement.getBoundingClientRect();
    const mustOffset = rect.right > window.innerWidth;
    this.offsetActive.set(mustOffset);

    if (mustOffset) dropdown.nativeElement.style.left = `${window.innerWidth - rect.right - 20}px`;
    else dropdown.nativeElement.style.left = '';
  }

  onClickDropdownBase(): void {
    // If it is clicked when it is opened, it means it was canceled.
    if (this.dropdownOpen()) this.onCancel.emit(true);
    this.dropdownOpen.set(!this.dropdownOpen());
  }

  onClickCancel(): void {
    this.onCloseDropdown();
    this.onCancel.emit(true);
  }

  onClickApply(): void {
    this.onCloseDropdown();
    this.onApply.emit(true);
  }
}
