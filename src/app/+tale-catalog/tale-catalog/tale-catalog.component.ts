import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { BaseComponent } from '~/app/framework/core';
import { routeAnimation } from '~/app/shared';

import { Tale } from '@tales/models/tale';
import { TalesService } from '@tales/tales.service';

@Component({
    templateUrl: './tale-catalog.component.html',
    styleUrls: ['tale-catalog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [routeAnimation]
})
export class TaleCatalogComponent extends BaseComponent implements OnInit, OnDestroy {
    showIntro = false;
    currentFilter = 'public';

    tales: BehaviorSubject<Array<Tale>> = new BehaviorSubject<Array<Tale>>([]);
    subscription: Subscription;

    constructor(private ref: ChangeDetectorRef, private taleService: TalesService) {
        super();
    }

    ngOnInit(): void {
        this.refresh();
    }

    ngOnDestroy(): void {
        this.unsubscribe();
    }

    trackById(index: number, tale: Tale): string {
        return tale._id;
    }

    refresh() {
        console.log("Calling GET");
        this.taleService.refresh().subscribe((data: Array<Tale>) => {
            console.log("Component got data:", data);
            this.tales.next(data);
            this.ref.detectChanges();
        });
    }


    unsubscribe() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
