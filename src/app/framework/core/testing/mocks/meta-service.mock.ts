import { Injectable } from '@angular/core';
@Injectable()
export class MockMetaService {
  setTag(key: string, value: string): void {
    return;
  }

  setTitle(title: string, override = false): void {
    return;
  }
}
