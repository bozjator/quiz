import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  inject,
} from '@angular/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LayoutService } from '../../layout.service';

@Component({
  selector: 'sidebar-item',
  imports: [RouterModule, CommonModule, MatIconModule, RouterLinkActive],
  template: `
    <li class="py-px">
      <a
        [routerLink]="uri()"
        routerLinkActive="bg-gray-700 text-white"
        (click)="layoutService.isMobileSidebarVisible.set(false)"
        class="flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-300 hover:bg-gray-700 hover:text-white"
      >
        <mat-icon>{{ icon() }}</mat-icon>
        {{ name() }}
      </a>
    </li>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarItemComponent {
  layoutService = inject(LayoutService);

  readonly name = input<string>('');
  readonly icon = input<string>('');
  readonly uri = input<string>('');
}
