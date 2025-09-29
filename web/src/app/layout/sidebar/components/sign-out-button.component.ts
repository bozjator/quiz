import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'sign-out-button',
  imports: [RouterModule],
  template: `
    <div class="mb-2 flex justify-center border-t-2 border-gray-700 pt-3">
      <a
        routerLink="/logout"
        class="cursor-pointer rounded-md p-2 px-4 pb-3 text-sm font-semibold text-gray-400 hover:bg-gray-900 hover:text-white"
      >
        Sign Out
      </a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignOutButtonComponent {}
