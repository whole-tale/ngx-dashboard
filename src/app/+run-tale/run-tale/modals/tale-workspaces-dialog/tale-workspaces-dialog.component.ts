import { Component, OnInit } from '@angular/core';
// import { Workspace } from '@api/models/workspace';   // TODO: Missing model
// import { WorkspaceService } from '@api/services/workspace.service';
import { Tale } from '@api/models/tale';
import { TaleService } from '@api/services/tale.service';
import { LogService }  from '@framework/core/log.service';

enum AccessLevel {
    None = -1,
    Read = 0,
    Write = 1,
    Admin = 2
}

@Component({
  templateUrl: './tale-workspaces-dialog.component.html',
  styleUrls: ['./tale-workspaces-dialog.component.scss']
})
export class TaleWorkspacesDialogComponent implements OnInit {
  selectedNav = 'tale_workspaces';
  tales: Array<Tale> = new Array<Tale>();

  constructor(private logger: LogService, private taleService: TaleService) {}

  ngOnInit(): void {
    const params = { level: AccessLevel.Read };
    this.taleService.taleListTales(params).subscribe(tales => {
      this.tales = tales;
    }, err => {
      this.logger.error("Failed to fetch Tales:", err)
    });
  }

  trackById(index: number, workspace: any): string {
      return workspace._id;
  }

  isNavActive(nav: string): boolean {
    return this.selectedNav === nav;
  }

  activateNav(nav: string): void {
    this.selectedNav = nav;
  }
}
