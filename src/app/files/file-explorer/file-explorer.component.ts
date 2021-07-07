import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FileElement } from '@files/models/file-element';
import { LogService } from '@shared/core/log.service';

import { MoveToDialogComponent } from './modals/move-to-dialog/move-to-dialog.component';
import { NewFolderDialogComponent } from './modals/new-folder-dialog/new-folder-dialog.component';
import { RenameDialogComponent } from './modals/rename-dialog/rename-dialog.component';

// import * as $ from 'jquery';
declare var $: any;

// Mapping of file extension to the icon that should be displayed
// See https://fontawesome.com/icons?d=listing&q=file-&s=solid
const FILE_TYPES = {
  // Text / Rich Text / CSV
  txt: 'file-alt',
  text: 'file-alt',
  pdf: 'file-pdf',
  doc: 'file-word',
  docx: 'file-word',
  ppt: 'file-powerpoint',
  xlsx: 'file-excel',
  xls: 'file-excel',
  csv: 'file-csv',

  // Audio / Image / Video
  wav: 'file-audio',
  mp3: 'file-audio',
  fla: 'file-audio',
  flac: 'file-audio',
  org: 'file-audio',
  jpg: 'file-image',
  jpeg: 'file-image',
  png: 'file-image',
  tiff: 'file-image',
  svg: 'file-image',
  mp4: 'file-video',
  avi: 'file-video',

  // Archive / Code
  tgz: 'file-archive',
  '7z': 'file-archive',
  zip: 'file-archive',
  rar: 'file-archive',
  tar: 'file-archive',
  gz: 'file-archive',
  r: 'file-code',
  py: 'file-code',
  java: 'file-code',
  js: 'file-code',
  ts: 'file-code',
  c: 'file-code',
  cpp: 'file-code',
  C: 'file-code',
  h: 'file-code',
  go: 'file-code',
  php: 'file-code',

  // ???
  dta: 'file-code',
  ado: 'file-code',
  do: 'file-code',
  tsv: 'file-csv',
  tab: 'file-csv',
  json: 'file-alt',
};

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss'],
})
export class FileExplorerComponent implements OnChanges {
  @ViewChild('file') file: any;

  @Input() preventNavigation = false;
  @Input() readOnly = false;
  @Input() readOnlyDropdown = false;
  @Input() allowRoot = false;
  @Input() showButtons = true;
  @Input() showContextMenu = true;

  // List of folders/files in the current folder
  @Input() fileElements: Array<FileElement>;

  // True if we are not at the root
  @Input() canNavigateUp: string;

  // The path to the current directory
  @Input() path: string;

  // Current nav value (either 'external_data' or 'tale_workspaces')
  @Input() currentNav: string;

  // Message to display if current folder is empty
  @Input() placeholderMessage: string;

  // Events emitted
  @Output() readonly openRegisterDataModal = new EventEmitter();
  @Output() readonly openSelectDataModal = new EventEmitter();
  @Output() readonly openTaleWorkspacesModal = new EventEmitter();
  @Output() readonly folderAdded = new EventEmitter<{ name: string }>();
  @Output() readonly fileUploadsAdded = new EventEmitter<{ files: { [key: string]: File } }>();
  @Output() readonly elementRemoved = new EventEmitter<FileElement>();
  @Output() readonly elementRenamed = new EventEmitter<FileElement>();
  @Output() readonly elementCopied = new EventEmitter<FileElement>();
  @Output() readonly elementDownloaded = new EventEmitter<FileElement>();
  @Output() readonly elementMoved = new EventEmitter<{ element: FileElement; moveTo?: FileElement }>();
  @Output() readonly navigatedDown = new EventEmitter<FileElement>();
  @Output() readonly navigatedUp = new EventEmitter();

  showMore: any = {};

  constructor(private readonly dialog: MatDialog, private readonly logger: LogService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.currentNav) {
      setTimeout(() => {
        $('.ui.file.dropdown').dropdown({ action: 'hide' });
      }, 1000);
    }
  }

  getIcon(element: FileElement): string {
    if (element._modelType === 'folder' || element._modelType === 'dataset' || element._modelType === 'workspace') {
      return 'fa-folder';
    } else if (element._modelType === 'file' || element._modelType === 'item') {
      const name = element.name || '';
      const segments = name.split('.');
      const ext = segments[segments.length - 1].split(' ')[0];

      const icon = FILE_TYPES[ext] || 'file';

      return `fa-${icon}`;
    } else {
      this.logger.error('Error: unable to get icon for FileElement - unrecognized modelType:', element);
    }
  }

  trackById(index: number, element: FileElement): string {
    return element._id;
  }

  openFileUploadDialog(): void {
    this.file.nativeElement.click();
  }

  onUploadsAdded($event: any): void {
    const target = $event.target || $event.srcElement;
    this.fileUploadsAdded.emit(this.file.nativeElement.files);
    target.value = '';
  }

  removeElement(element: FileElement): void {
    // Don't navigate if selecting a dropdown option
    event.stopPropagation();

    // TODO: Prompt for confirmation?
    this.elementRemoved.emit(element);
  }

  downloadElement(element: FileElement): void {
    // Don't navigate if selecting a dropdown option
    event.stopPropagation();

    this.elementDownloaded.emit(element);
  }

  copyElement(element: FileElement): void {
    // Don't navigate if selecting a dropdown option
    event.stopPropagation();

    this.elementCopied.emit(element);
  }

  navigate(element: FileElement): void {
    if (this.preventNavigation) {
      return;
    }
    if (element._modelType === 'folder') {
      this.navigatedDown.emit(element);
    }
  }

  navigateUp(): void {
    this.navigatedUp.emit();
  }

  moveElement(element: FileElement): void {
    // Don't navigate if selecting a dropdown option
    event.stopPropagation();

    this.elementMoved.emit({ element });
  }

  openMoveToDialog(element: FileElement): void {
    const dialogRef = this.dialog.open(MoveToDialogComponent, { data: { elementToMove: element } });
    dialogRef.afterClosed().subscribe((moveTo: FileElement) => {
      if (moveTo) {
        this.logger.info(`Moving ${element._modelType}Id=${element._id} to new parent:`, moveTo);
        this.elementMoved.emit({ element, moveTo });
      }
    });
  }

  openNewFolderDialog(): void {
    const dialogRef = this.dialog.open(NewFolderDialogComponent);
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.logger.debug(`Folder added: ${res}`);
        this.folderAdded.emit({ name: res });
      }
    });
  }

  renameElement(element: FileElement): void {
    // Don't navigate if selecting a dropdown option
    event.stopPropagation();

    const dialogRef = this.dialog.open(RenameDialogComponent);
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.logger.debug(`Folder renamed: ${element.name} -> ${res}`);
        element.name = res;
        this.elementRenamed.emit(element);
      }
    });
  }

  closeMenus(): void {
    this.showMore = {};
  }

  openMenu(event: MouseEvent, element: FileElement): void {
    // Don't navigate into folder if we're opening its dropdown
    event.stopPropagation();

    // If this wasn't the last menu opened, close any other open menus
    if (!this.showMore[element._id]) {
      this.closeMenus();
    }

    // Toggle the 'More Actions' dropdown menu of the clicked element
    this.showMore[element._id] = !this.showMore[element._id];
  }

  openSelectDataDialog(event: any): void {
    this.openSelectDataModal.emit(event);
  }

  openRegisterDataDialog(event: any): void {
    this.openRegisterDataModal.emit(event);
  }

  openTaleWorkspacesDialog(event: any): void {
    this.openTaleWorkspacesModal.emit(event);
  }
}
