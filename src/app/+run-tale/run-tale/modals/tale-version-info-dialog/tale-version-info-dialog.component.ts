import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Tale, Version } from '@api/models';
import { TaleService } from '@api/services';

import { Collaborator, CollaboratorList } from '@tales/components/rendered-tale-metadata/rendered-tale-metadata.component';

@Component({
  templateUrl: './tale-version-info-dialog.component.html',
  styleUrls: ['./tale-version-info-dialog.component.scss']
})
export class TaleVersionInfoDialogComponent implements OnInit {
  taleVersion: Tale;

  constructor(
    private readonly taleService: TaleService,
    @Inject(MAT_DIALOG_DATA) public data: {
                tale: Tale, version: Version, collaborators: CollaboratorList
              }) {}

  ngOnInit(): void {
    this.fetchVersionedTaleMetadata(this.data.tale._id, this.data.version._id);
  }

  fetchVersionedTaleMetadata(taleId: string, versionId: string): void {
    this.taleService.taleViewRestoredVersion(taleId, versionId).subscribe(taleVersion => {
      this.taleVersion = taleVersion;
    });
  }
}
