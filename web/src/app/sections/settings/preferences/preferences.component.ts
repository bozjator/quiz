import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../../layout/layout.service';
import { SettingProfileComponent } from './components/setting-profile/setting-profile.component';
import { SettingSecurityComponent } from './components/setting-security/setting-security.component';
import { SettingThemeComponent } from './components/setting-theme/setting-theme.component';

@Component({
  selector: 'preferences',
  imports: [CommonModule, SettingProfileComponent, SettingSecurityComponent, SettingThemeComponent],
  templateUrl: './preferences.component.html',
})
export class PreferencesComponent {
  layoutService = inject(LayoutService);

  view = {
    account: 0,
    theme: 2,
  };
  viewIndex = signal(this.view.account);

  constructor() {
    this.layoutService.setPageTitle('Preferences', 'manage_accounts');
  }
}
