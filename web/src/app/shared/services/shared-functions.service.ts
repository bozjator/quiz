import { ElementRef, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SharedFunctionsService {
  /**
   * If [text] is longer then [maxLineLength] it will first split [text] into
   * two parts on the index where the '@' char is. Then it will take a look if
   * first and second parts are still to long and split them at [maxLineLength]
   * index. Then it will join split text with spaces.
   *
   * @param maxLineLength Max characters per line.
   * @param text Text to split.
   * @returns Text with spaces inserted.
   */
  splitEmail(maxLineLength: number, text: string): string {
    if (!text || text.length === 0) return '';
    if (text.length <= maxLineLength) return text;

    const splitOnAtChar = text.split('@');
    if (splitOnAtChar.length == 2) splitOnAtChar[1] = '@' + splitOnAtChar[1];

    const splitsReady: string[] = [];
    for (const splitText of splitOnAtChar) {
      if (splitText.length > maxLineLength) {
        splitsReady.push(splitText.slice(0, maxLineLength));
        splitsReady.push(splitText.slice(maxLineLength));
      } else splitsReady.push(splitText);
    }

    return splitsReady.join(' ');
  }

  getHttpErrorMessages(error: HttpErrorResponse): string {
    // Prop error?.error?.message can hold array of strings or a single string.
    const messages = error?.error?.message ?? ' Unknown error';
    return Array.isArray(messages) ? messages.join(', ') : messages;
  }

  /**
   * Transforms duration into 'HH h MM min' or 'HH:MM' format.
   * For example '12 h 34 min' or '12:34'.
   *
   * If hours are 0, they will not be included.
   *
   * @param duration Duration in seconds.
   * @param addHMinText If true will return 'HH h MM min' format, otherwise 'HH:MM'.
   */
  getDurationAsHHMM(duration: number, addHMinText: boolean = true): string {
    const durationInMinutes = Math.floor(duration / 60) + (duration % 60 >= 30 ? 1 : 0);
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;

    const hoursString = hours.toString().padStart(2, '0');
    const minutesString = minutes.toString().padStart(2, '0');

    const parts = [];
    if (addHMinText) {
      if (hours) parts.push(`${hoursString} h`);
      parts.push(`${minutesString} min`);
      return parts.join(' ');
    } else {
      hours ? parts.push(hoursString) : parts.push('00');
      parts.push(minutesString);
      return parts.join(':');
    }
  }

  /**
   * Splits hours and minutes.
   *
   * Example: if string is '?? h ?? min', it will return '?? h' and '?? min' strings.
   *
   * @param hhmm String in '?? h ?? min' format.
   */
  splitHHMMDuration(hhmm: string): string[] {
    const parts = hhmm.split(' ');
    if (parts.length === 2) return [`${parts[0]} ${parts[1]}`, ''];
    if (parts.length === 4) return [`${parts[0]} ${parts[1]}`, `${parts[2]} ${parts[3]}`];
    return ['? h', '? min'];
  }

  /**
   * Returns div width without margin or padding.
   *
   * @param divRef Element reference.
   * @returns Div width without margin or padding.
   */
  getDivWidth(divRef: ElementRef<any>): number {
    const element = divRef.nativeElement;

    const computedStyle = window.getComputedStyle(element);

    const marginLeft = parseFloat(computedStyle.marginLeft) || 0;
    const marginRight = parseFloat(computedStyle.marginRight) || 0;
    const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
    const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
    const borderLeft = parseFloat(computedStyle.borderLeftWidth) || 0;
    const borderRight = parseFloat(computedStyle.borderRightWidth) || 0;

    const actualWidth =
      element.offsetWidth -
      marginLeft -
      marginRight -
      paddingLeft -
      paddingRight -
      borderLeft -
      borderRight;

    return actualWidth;
  }

  /**
   * Will set cursor to the end in the nativeElement.
   */
  static setCursorToEnd(nativeElement: any) {
    const range = document.createRange();
    const selection = window.getSelection();

    // Set the range to the end of the content.
    range.selectNodeContents(nativeElement);
    // Collapse the range to the end of the text.
    range.collapse(false);

    // Clear existing selections and add the new range.
    selection?.removeAllRanges();
    selection?.addRange(range);
  }

  static getRandomDecimal(min: number, max: number) {
    const decimal = Math.random() * (max - min) + min;
    return parseFloat(decimal.toFixed(2));
  }

  static sanitizeFileName(fileName: string) {
    const invalidChars = /[<>:"/\\|?*\x00-\x1F]/g;
    return fileName.replace(invalidChars, '_');
  }

  static isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  static isValidEnumValue<T extends object>(enumObj: T, value: string | null) {
    return Object.values(enumObj).includes(value as T[keyof T]);
  }
}
