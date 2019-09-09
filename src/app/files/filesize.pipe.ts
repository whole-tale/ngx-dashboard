import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fileSize' })
export class FileSizePipe implements PipeTransform {
  constructor(private readonly decimal: DecimalPipe) {}

  round_to_precision(x: number, precision: number = null) {
    const y = +x + (!precision ? 0.5 : precision / 2);
    return y - (y % (!precision ? 1 : +precision));
  }

  transform(value: number): string {
    if (!value) {
      return '';
    }

    let val = JSON.parse(JSON.stringify(value));
    const limit = 1024;
    let magnitude = 0;
    while (val > limit) {
      magnitude++;
      val /= 1024;
    }

    // Round to the nearest hundreth
    // val = this.round_to_precision(val, 0.01);

    // Assign label based on how many times we divided
    switch (magnitude) {
      case 0:
        return `${this.decimal.transform(val)} B`;
      case 1:
        return `${this.decimal.transform(val)} KB`;
      case 2:
        return `${this.decimal.transform(val)} MB`;
      case 3:
        return `${this.decimal.transform(val)} GB`;
      case 4:
        return `${this.decimal.transform(val)} TB`;
      case 5:
        return `${this.decimal.transform(val)} PB`;
      default:
        // Higher values are unsupported - display these as raw bytes
        return `${this.decimal.transform(value)} B`;
    }
  }
}
