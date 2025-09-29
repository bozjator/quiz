import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { mainNavigation } from '../../app.routes';
import { AppState } from '../../shared/store/app-store';
import { User } from '../../auth/models/auth.models';
import { SidebarItemComponent } from './components/sidebar-item.component';
import { SharedFunctionsService } from '../../shared/services/shared-functions.service';
import { AuthSelectors } from '../../auth/store/auth.selectors';
import { NavigationGroup } from './models/navigation.model';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'sidebar',
  imports: [RouterModule, SidebarItemComponent],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  readonly layoutService = inject(LayoutService);
  private readonly store = inject<Store<AppState>>(Store);
  private readonly sharedFn = inject(SharedFunctionsService);

  navigationGroups: NavigationGroup[] = mainNavigation;

  userFullName = signal('...');
  userEmail = signal('...');

  constructor() {
    this.store
      .select(AuthSelectors.loggedInUser)
      .pipe(takeUntilDestroyed())
      .subscribe((user?: User) => {
        if (!user) return;

        this.userFullName.set(`${user.firstName} ${user.lastName}`);
        this.userEmail.set(this.sharedFn.splitEmail(26, user.email));
      });
  }
}
