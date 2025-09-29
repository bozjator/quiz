import { trigger, transition, style, animate } from '@angular/animations';

export const opacityAnimation = trigger('opacityAnimation', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('400ms', style({ opacity: 1 })),
  ]),
  transition(':leave', [
    style({ opacity: 1 }),
    animate('400ms', style({ opacity: 0 })),
  ]),
]);

export const leftSideAnimation = trigger('leftSideAnimation', [
  transition(':enter', [
    style({ transform: 'translateX(-100%)' }),
    animate('300ms ease-in-out', style({ transform: 'translateX(0)' })),
  ]),
  transition(':leave', [
    style({ transform: 'translateX(0)' }),
    animate('300ms ease-in-out', style({ transform: 'translateX(-100%)' })),
  ]),
]);
