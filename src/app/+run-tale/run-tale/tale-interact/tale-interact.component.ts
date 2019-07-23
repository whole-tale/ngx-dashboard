import { Component, OnChanges, Input, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { InstanceService } from '@api/services/instance.service';
import { Instance } from '@api/models/instance';
import { Tale } from '@api/models/tale';

@Component({
  selector: 'tale-interact',
  templateUrl: './tale-interact.component.html',
  styleUrls: ['./tale-interact.component.scss']
})
export class TaleInteractComponent implements OnChanges {
  @Input() tale: Tale;
  instance: Instance;

  constructor(private ref: ChangeDetectorRef, private route: ActivatedRoute, private instanceService: InstanceService) { }

  ngOnChanges() {
    if (this.tale) {
      this.instanceService.instanceGetInstance(this.tale._id).subscribe(instance => {
        this.instance = instance;
        this.ref.detectChanges();
      }, err => {
        console.error(`Failed to pull instance for taleId=${this.tale._id}`, err);
      });
    }
  }
}
