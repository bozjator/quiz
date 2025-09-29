import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from './dialog.component';

@Component({
  selector: 'app-dialog-confirmation',
  template: `
    <app-dialog [title]="data.title">
      <div class="dark:text-gray-100">
        {{ data.content }}
      </div>
      <ng-container footer>
        <button class="app-btn-sec" (click)="onClose()">Cancel</button>
        <button class="app-btn" (click)="onOK()">OK</button>
      </ng-container>
    </app-dialog>
  `,
  imports: [DialogComponent],
})
export class ConfirmationDialogComponent {
  private dialogRef = inject<MatDialogRef<ConfirmationDialogComponent>>(MatDialogRef);
  data = inject<{
    title: string;
    content: string;
  }>(MAT_DIALOG_DATA);

  constructor() {
    this.data = {
      title: this.data?.title || 'Confirmation',
      content: this.data?.content || 'Are you sure?',
    };
  }

  onClose() {
    this.dialogRef.close(false);
  }

  onOK() {
    this.dialogRef.close(true);
  }
}
