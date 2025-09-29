import { Observable } from 'rxjs';
import { AlertType } from '../../../alert.component';

export interface NotificationSubscription {
  observable: Observable<any>;
  title?: string;
  message: string;
  type: AlertType;
}
