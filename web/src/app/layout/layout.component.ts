import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarMobileComponent } from './sidebar-mobile/sidebar-mobile.component';
import { SidebarDesktopComponent } from './sidebar-desktop/sidebar-desktop.component';
import { TitlebarComponent } from './titlebar/titlebar.component';
import { LayoutService } from './layout.service';
import { LayoutStyleEnum } from '../shared/models/other/layout-style.enum';

@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarMobileComponent,
    SidebarDesktopComponent,
    TitlebarComponent,
  ],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  layoutService = inject(LayoutService);
  layoutStyleEnum = LayoutStyleEnum;
}
