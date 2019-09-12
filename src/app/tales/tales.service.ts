import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { LogService } from '@framework/core/log.service';
import { Tale } from '@tales/models/tale';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TalesService implements OnDestroy {
  tales: BehaviorSubject<Array<Tale>> = new BehaviorSubject<Array<Tale>>([]);
  subscription: Subscription;

  constructor(private readonly http: HttpClient, private readonly logger: LogService) {
    this.refresh();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  get(): Observable<any> {
    return this.http.get('assets/data/tales.json');
  }

  refresh(): Observable<Array<Tale>> {
    this.unsubscribe();
    const observable = this.get();
    this.subscription = observable.subscribe((data: Array<Tale>) => {
      this.logger.debug('Service got data:', data);
      this.tales.next(data);
    });

    return observable;
  }

  unsubscribe(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
