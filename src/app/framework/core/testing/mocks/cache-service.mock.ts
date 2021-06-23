import { Injectable } from '@angular/core';
@Injectable()
export class MockCacheService {
  get(key: string | number): any {
    return undefined;
  }

  clear(): any {
    return;
  }
}
