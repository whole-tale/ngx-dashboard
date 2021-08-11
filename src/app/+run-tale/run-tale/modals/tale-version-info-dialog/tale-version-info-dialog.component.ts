import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Tale, Version } from '@api/models';
import { TaleService } from '@api/services';
import { LogService } from '@shared/core';

import { Collaborator, CollaboratorList } from '@tales/components/rendered-tale-metadata/rendered-tale-metadata.component';

@Component({
  templateUrl: './tale-version-info-dialog.component.html',
  styleUrls: ['./tale-version-info-dialog.component.scss']
})
export class TaleVersionInfoDialogComponent implements OnInit {
  taleVersion: Tale;

  constructor(
    private readonly ref: ChangeDetectorRef,
    private readonly taleService: TaleService,
    private readonly logger: LogService,
    @Inject(MAT_DIALOG_DATA) public data: {
                tale: Tale, version: Version
              }) {}

  ngOnInit(): void {
    this.logger.debug("Fetching tale version: ", this.data.version._id);
    this.fetchVersionedTaleMetadata(this.data.tale._id, this.data.version._id);
  }

  fetchVersionedTaleMetadata(taleId: string, versionId: string): void {
    this.taleService.taleViewRestoredVersion(taleId, versionId).subscribe(taleVersion => {
      this.taleVersion = taleVersion;
      this.logger.debug("Fetched tale version: ", taleVersion);
      this.ref.detectChanges();
    });
  }
}
