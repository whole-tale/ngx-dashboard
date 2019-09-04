import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { FilesService } from '@files/files.service';
import { FileElement } from '@files/models/file-element';

import { NewFolderDialogComponent } from './modals/new-folder-dialog/new-folder-dialog.component';
import { RenameDialogComponent } from './modals/rename-dialog/rename-dialog.component';

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
  json: 'file-alt'
};

@Component({
  selector: 'file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss']
})
export class FileExplorerComponent implements OnInit {
  @ViewChild('file') file: any;

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
  @Output() folderAdded = new EventEmitter<{ name: string }>();
  @Output() fileUploadsAdded = new EventEmitter<{ files: { [key: string]: File } }>();
  @Output() elementRemoved = new EventEmitter<FileElement>();
  @Output() elementRenamed = new EventEmitter<FileElement>();
  @Output() elementMoved = new EventEmitter<{ element: FileElement; moveTo: FileElement }>();
  @Output() navigatedDown = new EventEmitter<FileElement>();
  @Output() navigatedUp = new EventEmitter();

  constructor(public dialog: MatDialog, public fileService: FilesService) {}

  ngOnInit() {}

  getIcon(element: FileElement) {
    if (element._modelType === 'folder' || element._modelType === 'dataset' || element._modelType === 'workspace') {
      return 'fa-folder';
    } else if (element._modelType === 'file' || element._modelType === 'item') {
      const name = element.name || '';
      const segments = name.split('.');
      const ext = segments[segments.length - 1].split(' ')[0];

      const icon = FILE_TYPES[ext] || 'file';

      return 'fa-' + icon;
    } else {
      console.error('Error: unable to get icon for FileElement - unrecognized modelType:', element);
    }
  }

  openFileUploadDialog() {
    this.file.nativeElement.click();
  }

  onUploadsAdded() {
    this.fileUploadsAdded.emit(this.file.nativeElement.files);
  }

  deleteElement(element: FileElement) {
    this.elementRemoved.emit(element);
  }

  navigate(element: FileElement) {
    if (element._modelType == 'folder') {
      this.navigatedDown.emit(element);
    }
  }

  navigateUp() {
    this.navigatedUp.emit();
  }

  moveElement(element: FileElement, moveTo: FileElement) {
    this.elementMoved.emit({ element, moveTo });
  }

  openNewFolderDialog() {
    const dialogRef = this.dialog.open(NewFolderDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        console.log(`Folder added: ${res}`);
        this.folderAdded.emit({ name: res });
      }
    });
  }

  openRenameDialog(element: FileElement) {
    const dialogRef = this.dialog.open(RenameDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        console.log(`Folder renamed: ${element.name} -> ${res}`);
        element.name = res;
        this.elementRenamed.emit(element);
      }
    });
  }

  openMenu(event: MouseEvent, element: FileElement, viewChild: MatMenuTrigger) {
    event.preventDefault();
    viewChild.openMenu();
  }
}
