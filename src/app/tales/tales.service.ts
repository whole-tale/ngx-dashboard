import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { Tale } from '@tales/models/tale';

@Injectable({
  providedIn: 'root'
})
export class TalesService implements OnDestroy {
  tales: BehaviorSubject<Array<Tale>> = new BehaviorSubject<Array<Tale>>([]);
  subscription: Subscription;

  constructor(private readonly http: HttpClient) {
    this.refresh();
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  get(): Observable<any> {
    console.log('Fetching records');
    return this.http.get('assets/data/tales.json');
  }

  refresh() {
    this.unsubscribe();
    const observable = this.get();
    this.subscription = observable.subscribe((data: Array<Tale>) => {
      console.log('Service got data:', data);
      this.tales.next(data);
    });
    return observable;
  }

  unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
