import { Component, inject } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LayoutService } from '../../../../../layout/layout.service';
import { PageSectionTitleComponent } from '../../../../../shared/components/titles/page-section-title.component';
import { LayoutStyleEnum } from '../../../../../shared/models/other/layout-style.enum';

@Component({
  selector: 'setting-theme',
  templateUrl: './setting-theme.component.html',
  imports: [MatRadioModule, MatSlideToggleModule, PageSectionTitleComponent],
})
export class SettingThemeComponent {
  layoutService = inject(LayoutService);
  layoutStyleEnum = LayoutStyleEnum;
}
