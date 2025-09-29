import { effect, Injectable, signal } from '@angular/core';
import { APP_STORAGE_NAMES } from '../shared/models/other/app-storage-name.enum';
import { LayoutStyleEnum } from '../shared/models/other/layout-style.enum';
import { SharedFunctionsService } from '../shared/services/shared-functions.service';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  readonly isMobileSidebarVisible = signal(false);

  readonly isDarkMode = signal(false);
  readonly layoutStyle = signal(LayoutStyleEnum.frameless);

  readonly pageTitle = signal('');
  readonly pageTitleIcon = signal('');

  constructor() {
    this.initLayoutStyle();
    this.initIsDarkMode();
    this.setupEffects();
  }

  private setupEffects() {
    // Set isDarkMode signal effect.
    effect(() => {
      window.localStorage.setItem(APP_STORAGE_NAMES.isDarkMode, JSON.stringify(this.isDarkMode()));
      this.setThemeClassOnBody();
    });

    // Set layoutStyle signal effect.
    effect(() => {
      window.localStorage.setItem(APP_STORAGE_NAMES.layoutStyle, this.layoutStyle());
    });
  }

  private initIsDarkMode() {
    const isDarkMode: boolean = JSON.parse(
      window.localStorage.getItem(APP_STORAGE_NAMES.isDarkMode) ??
        window.matchMedia('(prefers-color-scheme: dark)').matches.toString(),
    );
    this.isDarkMode.set(isDarkMode);
    this.setThemeClassOnBody();
  }

  private initLayoutStyle() {
    const style = window.localStorage.getItem(APP_STORAGE_NAMES.layoutStyle);
    const layoutStyle = SharedFunctionsService.isValidEnumValue(LayoutStyleEnum, style)
      ? (style as LayoutStyleEnum)
      : LayoutStyleEnum.frameless;
    this.layoutStyle.set(layoutStyle);
  }

  private setThemeClassOnBody(): void {
    this.isDarkMode()
      ? document.body.classList.add('dark')
      : document.body.classList.remove('dark');
  }

  setPageTitle(title: string, icon?: string) {
    this.pageTitle.set(title);
    if (icon) this.pageTitleIcon.set(icon);
  }
}
