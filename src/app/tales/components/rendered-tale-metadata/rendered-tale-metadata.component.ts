import { Component, Input } from '@angular/core';
import { PublishInfo } from '@api/models/publish-info';
import { Tale } from '@api/models/tale';
import { User } from '@api/models/user';
import { TaleAuthor } from '@tales/models/tale-author';

// import * as $ from 'jquery';
declare var $: any;

// FIXME: Duplicated code - see tale-sharing.component.ts
export interface CollaboratorList {
  users: Array<Collaborator>;
  groups: Array<Collaborator>;
}

// FIXME: Duplicated code - see tale-sharing.component.ts
export interface Collaborator {
  id: string;
  level: number;
  login: string;
  name: string;
  flags?: Array<any>;
  showAlert?: boolean;
  gravatar_baseUrl?: string;
  affiliation?: string;
}

@Component({
  selector: 'app-rendered-tale-metadata',
  templateUrl: './rendered-tale-metadata.component.html',
  styleUrls: ['./rendered-tale-metadata.component.scss'],
})
export class RenderedTaleMetadataComponent {
  @Input() tale: Tale;
  @Input() creator: User;

  // FIXME: Duplicated code (see publish-tale-dialog.component.ts)
  get latestPublish(): PublishInfo {
    if (!this.tale?.publishInfo?.length) {
      return undefined;
    }

    // Sort by date, then
    return this.tale.publishInfo
      .sort((a: PublishInfo, b: PublishInfo) => {
        // Example Format: "2019-01-23T15:48:17.476000+00:0"
        const dateA = Date.parse(a.date);
        const dateB = Date.parse(b.date);
        if (dateA > dateB) {
          return 1;
        }
        if (dateA < dateB) {
          return -1;
        }

        return 0;
      })
      .slice(-1)
      .pop();
  }

  trackById(index: number, model: any): string {
    return model._id || model.orcid || model.itemId || model.identifier;
  }

  trackByAuthorHash(index: number, author: TaleAuthor): number {
    return index;
  }

  transformIdentifier(identifier: string): string {
    if (identifier.indexOf('doi:') === 0) {
      return identifier.replace('doi:', 'https://doi.org/');
    }

    return identifier;
  }
}
