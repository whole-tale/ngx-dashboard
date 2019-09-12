import { ChangeDetectorRef, Component, Input, NgZone, OnChanges } from '@angular/core';
import { Instance } from '@api/models/instance';
import { Tale } from '@api/models/tale';
import { InstanceService } from '@api/services/instance.service';
import { enterZone } from '@framework/ngrx/enter-zone.operator';

@Component({
  selector: 'app-tale-interact',
  templateUrl: './tale-interact.component.html',
  styleUrls: ['./tale-interact.component.scss']
})
export class TaleInteractComponent implements OnChanges {
  @Input() tale: Tale;
  @Input() instance: Instance;

  constructor(private ref: ChangeDetectorRef,
              private zone: NgZone,
              private instanceService: InstanceService) {  }

  ngOnChanges(): void {
    if (this.tale) {
      const params = { taleId: this.tale._id };
      this.instanceService.instanceListInstances(params)
                          .pipe(enterZone(this.zone))
                          .subscribe((instances: Array<Instance>) => {
        if (instances && instances.length) {
          this.instance = instances[0];
          // this.ref.detectChanges();
        }
      }, err => {
        console.error(`Error: Failed to fetch instances for taleId=${this.tale._id}`, err);
      });
    }
  }
}
