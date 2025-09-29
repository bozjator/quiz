import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'titlebar',
  imports: [CommonModule, MatIconModule],
  templateUrl: './titlebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TitlebarComponent {
  layoutService = inject(LayoutService);
}
