import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { LayoutService } from '../layout.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SignOutButtonComponent } from '../sidebar/components/sign-out-button.component';
import { leftSideAnimation, opacityAnimation } from '../../shared/animations';

@Component({
  selector: 'sidebar-mobile',
  imports: [NgIf, SidebarComponent, SignOutButtonComponent],
  templateUrl: './sidebar-mobile.component.html',
  animations: [leftSideAnimation, opacityAnimation],
})
export class SidebarMobileComponent {
  layoutService = inject(LayoutService);
}
