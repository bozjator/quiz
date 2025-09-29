import { Injectable, inject } from '@angular/core';
import { filter, skip, Subject, takeUntil } from 'rxjs';
import { NotificationService } from './notification.service';
import { NotificationSubscription } from './models/notification-subscription.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationSubscriptionService {
  private notificationService = inject(NotificationService);

  private unsubscribeSubjects = new Map<number, Subject<any>>();

  private subscribeEach(subs: NotificationSubscription[], unsubscribeSubject: Subject<any>) {
    subs.forEach((sub) =>
      sub.observable
        .pipe(
          takeUntil(unsubscribeSubject),
          skip(1),
          filter((value) => !!value),
        )
        .subscribe(() =>
          this.notificationService.show(sub.message, {
            title: sub.title,
            type: sub.type,
          }),
        ),
    );
  }

  /**
   * Subscribes to given observables and shows its message on received value.
   * Use returned key to unsubscribe from created subscriptions.
   *
   * NOTE: The first value received after subscribing will be ignored,
   * as well as all falsy values.
   *
   * @param subs Observables with its messages.
   * @returns Key for unsubscribing.
   */
  subscribe(subs: NotificationSubscription[]): number {
    const key = Date.now();
    const unsubscribeSubject = new Subject();
    this.subscribeEach(subs, unsubscribeSubject);
    this.unsubscribeSubjects.set(key, unsubscribeSubject);
    return key;
  }

  /**
   * Unsubscribes from subscriptions.
   *
   * @param key Key for unsubscribing existing subscription.
   */
  unsubscribe(key?: number) {
    if (!key) return;
    const unsubscribeSubject = this.unsubscribeSubjects.get(key);
    this.unsubscribeSubjects.delete(key);
    unsubscribeSubject?.next(undefined);
    unsubscribeSubject?.complete();
  }
}
