import { ChangeDetectorRef, Component, Input, NgZone, OnInit } from '@angular/core';
import { Tale } from '@api/models/tale';
import { TaleService } from '@api/services/tale.service';
import { LogService } from '@framework/core/log.service';
import { enterZone } from '@framework/ngrx/enter-zone.operator';
import { TaleAuthor } from '@tales/models/tale-author';
import { Observable } from 'rxjs';

// import * as $ from 'jquery';
declare var $: any;

@Component({
  selector: 'app-tale-versions-panel',
  templateUrl: './tale-versions-panel.component.html',
  styleUrls: ['./tale-versions-panel.component.scss']
})
export class TaleVersionsPanelComponent implements OnInit {
  @Input() tale: Tale;

  // TODO: Wire up to API
  timeline: Array<any> = [];

  constructor(private ref: ChangeDetectorRef,
              private zone: NgZone,
              private logger: LogService,
              private taleService: TaleService) {

  }

  ngOnInit(): void {
    setTimeout(() => {
      $('.ui.dropdown').dropdown();
    }, 500);

    this.timeline = [
      {
        id: '1',
        date: 'Sept 5, 2019 10:29AM',
        title: 'Version saved:',
        label: 'Version 1.0'
      },
      {
        id: '2',
        title: 'Version saved:',
        date: 'Sept 5, 2019 10:31AM'
      },
      {
        id: '3',
        title: 'Version saved:',
        date: 'Sept 5, 2019 10:35AM'
      }
    ];
  }

  trackById(index: number, model: any): string {
    return model._id || model.orcid || model.itemId;
  }

  /** Global panel functions */
  saveNewVersion() {

  }

  editRunConfigurations() {

  }

  performRecordedRun() {

  }

  /** Per-version dropdown options */
  viewVersionInfo(version: any) {

  }

  restoreVersion(version: any) {

  }

  compareVersion(version: any) {

  }

  renameVersion(version: any) {

  }

  deleteVersion(version: any) {

  }
}
