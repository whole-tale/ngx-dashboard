import { ChangeDetectorRef, Component, Input, NgZone, OnInit } from '@angular/core';
import { Tale } from '@api/models/tale';
import { Version } from '@api/models/version';
import { TaleService } from '@api/services/tale.service';
import { VersionService } from '@api/services/version.service';
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
              private taleService: TaleService,
              private versionService: VersionService) {

  }

  ngOnInit(): void {
    setTimeout(() => {
      $('.ui.version.dropdown').dropdown();
    }, 500);

    // TODO: What is the return type here? Folder? Something else?
    this.versionService.versionGetRoot(this.tale._id).subscribe((root: any) => {
      this.logger.info("Found root:", root);
      this.versionService.versionListVersions({ rootId: root._id }).subscribe((versions: Array<Version>) => {
        this.logger.info("Found versions:", versions);
        this.timeline = versions.sort(this.sortByUpdatedDate);
        this.ref.detectChanges();
      });
    });

    // Mock data
    /*this.timeline = [
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
    ];*/
  }

  /**
   * Compare two Version objects and return a number value that
   * represents the result of comparing their updated times:
   *   0 if the two version updated date/time are equal
   *   1 if the first version is after (greater than) the second
   *   -1 if the first version is before (less than) the second
   *
   * @param a First version to compare
   * @param b Second version to compare
   */
  sortByUpdatedDate(a: Version, b: Version): number {
    const dateA = new Date(a.updated);
    const dateB = new Date(b.updated);
    if (dateA < dateB) {
      return 1;
    } else if (dateA > dateB) {
      return -1;
    } else {
      return 0;
    }
  }

  trackById(index: number, model: any): string {
    return model._id || model.orcid || model.itemId;
  }

  /** Global panel functions */
  saveNewVersion() {
     console.log('Saving Tale version');
      this.versionService.versionCreateVersion({ taleId: this.tale._id, force: true }).subscribe(version => {
        console.log("Version saved successfully:", version);
      });
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
    this.versionService.versionDeleteVersion(version._id).subscribe(response => {
      this.logger.info("Tale version successfully deleted:", version.name);
    });
  }
}
