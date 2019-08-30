import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { FilesService } from '@files/files.service';
import { FileElement } from '@files/models/file-element';

import { NewFolderDialogComponent } from './modals/new-folder-dialog/new-folder-dialog.component';
import { RenameDialogComponent } from './modals/rename-dialog/rename-dialog.component';

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
