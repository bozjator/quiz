import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../layout.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SignOutButtonComponent } from '../sidebar/components/sign-out-button.component';
import { LayoutStyleEnum } from '../../shared/models/other/layout-style.enum';

@Component({
  selector: 'sidebar-desktop',
  imports: [CommonModule, SidebarComponent, SignOutButtonComponent],
  templateUrl: './sidebar-desktop.component.html',
})
export class SidebarDesktopComponent {
  layoutService = inject(LayoutService);
  layoutStyleEnum = LayoutStyleEnum;
}
