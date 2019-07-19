import { Component, OnInit, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Tale } from '@api/models/tale';
import { TaleService } from '@api/services/tale.service';

import { Instance } from '@api/models/instance';
import { InstanceService } from '@api/services/instance.service';

import { CopyOnLaunchModalComponent } from '../../modals/copy-on-launch-modal/copy-on-launch-modal.component';
import { ErrorModalComponent } from '@shared/error-modal/error-modal.component';

@Component({
  selector: 'tale-run-button',
  templateUrl: './tale-run-button.component.html',
  styleUrls: ['./tale-run-button.component.scss']
})
export class TaleRunButtonComponent implements OnInit {
  
  @Input() instances: Map<string, Instance>;
  @Input() tale: Tale;

  @Output()
  taleInstanceStateChanged = new EventEmitter<Tale>();

  constructor(private zone: NgZone, private dialog: MatDialog, private taleService: TaleService, private instanceService: InstanceService) { 

  }

  ngOnInit() {

  }


  startTale() {
    /* MOCK DATA:
    
    this.instances[tale._id] = { status: 0 };
    console.log("Starting tale:", tale._id);
    let interval = setInterval(() => {
      this.instances[tale._id] = { status: 1 };
      console.log("Tale started:", tale._id);
      this.ref.detectChanges();
    }, 3000);*/

    if (this.tale._accessLevel < 2) {
      this.openCopyOnLaunchModal();
      return;
    }

    let stopPolling = (interval: any) => {
        clearInterval(interval);
        interval = null;
    };

    let params: InstanceService.InstanceCreateInstanceParams = { taleId: this.tale._id };
    this.instanceService.instanceCreateInstance(params).subscribe((instance: Instance) => {
      this.zone.run(() => {
        console.log("Starting tale:", this.tale._id);
        this.instances[this.tale._id] = instance;
        this.taleInstanceStateChanged.emit(this.tale);
        //this.refilter();

        // Poll / wait for launch
        // TODO: Fix edge cases (refresh, etc)
        this.zone.runOutsideAngular(() => {
          let interval = setInterval(() => {
            this.instanceService.instanceGetInstance(instance._id).subscribe((watched: Instance) => {
              console.log("Polling for instance status:", watched._id);
              //this.refilter();
              this.taleInstanceStateChanged.emit(this.tale);
              
              // Once instance is running, stop the polling
              if (watched.status === 1) {
                this.zone.run(() => {
                  this.instances[this.tale._id] = watched;
                  stopPolling(interval);
                });
              }
            }, err => {
              console.error("Error polling for instance status:", err);
                
              // Stop the polling if an error is hit
              stopPolling(interval);
            });
          }, 2000);
        });
      });
    }, (err: any) => {
      console.error("Failed to create instance:", err);
    });
  }

  stopTale() {
    /* MOCK DATA:
    
    this.instances[tale._id] = { status: 2 };
    console.log("Stopping tale:", tale._id);
    setTimeout(() => {
      this.instances[tale._id] = null;
      console.log("Tale stopped:", tale._id);
      this.ref.detectChanges();
    }, 3000);*/

    let instance = this.instances[this.tale._id];
    if (!instance) {
        console.log("No instance found for taleId=", this.tale._id);
        return;
    }

    this.instanceService.instanceDeleteInstance(instance._id).subscribe((instance: Instance) => {
      this.zone.run(() => {
        console.log("Stopping tale:", this.tale._id);
        this.instances[this.tale._id] = null;
        //this.refilter();
        this.taleInstanceStateChanged.emit(this.tale);
      });
    }, (err: any) => {
      console.error("Failed to delete instance:", err);
    });
  }

  openCopyOnLaunchModal() {
    const dialogRef = this.dialog.open(CopyOnLaunchModalComponent);
    dialogRef.afterClosed().subscribe((res: any) => {
        if (!res) { return; }

        this.taleService.taleCopyTale(this.tale._id).subscribe(taleCopy => {
            console.log("Successfully copied Tale... now launching!", taleCopy);
            //this.refresh();
            //this.startTale(taleCopy);
            this.taleInstanceStateChanged.emit(taleCopy);
        }, err => {
            console.error("Failed to copy Tale:", err);

        });
    });
  }

}
