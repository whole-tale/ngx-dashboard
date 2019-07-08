import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { FileElement } from '@files/models/file-element';
import { FilesService } from '@files/files.service';

@Component({
  selector: 'tale-files',
  templateUrl: './tale-files.component.html',
  styleUrls: ['./tale-files.component.scss']
})
export class TaleFilesComponent implements OnInit {
  fileElements: Observable<FileElement[]>;
  currentRoot: FileElement;
  currentPath: string;
  canNavigateUp = false;

  constructor(public route: ActivatedRoute, public fileService: FilesService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
        const folderid = params['folderid'] || null;
        if (folderid) {
          this.currentRoot = this.fileService.get(folderid);
          console.log(`currentRoot is now: ${this.currentRoot.name}`);
          
          this.canNavigateUp = this.currentRoot ? true : false;

          // Build up currentPath by traversing up from currentRoot
          let path = "";
          let currentDir = this.currentRoot;
          while (currentDir != null) {
            path = `${currentDir.name}/` + path; 
            currentDir = this.fileService.get(currentDir.baseParentId);
          }
          this.currentPath = path;
        } else {
          console.log("No fileId given, so no currentRoot set");
        }
          
        this.fileElements = this.fileService.queryInFolder(this.currentRoot ? this.currentRoot._id : null);
    });
  }

  addFolder(folder: { name: string }) {
    const now = new Date();
    const e = new FileElement();
    e._modelType = "folder";
    e.created = e.updated = now;
    e.description = "";
    e.size = 0;
    e.baseParentId = this.currentRoot ? this.currentRoot._id : null;
    e.name = folder.name;
    this.fileService.add(e);
    this.updateFileElementQuery();
  }

  removeElement(element: FileElement) {
    this.fileService.delete(element._id);
    this.updateFileElementQuery();
  }

  moveElement(event: { element: FileElement; moveTo: FileElement }) {
    this.fileService.update(event.element._id, { baseParentId: event.moveTo._id });
    this.updateFileElementQuery();
  }

  renameElement(element: FileElement) {
    this.fileService.update(element._id, { name: element.name });
    this.updateFileElementQuery();
  }

  updateFileElementQuery() {
    this.fileElements = this.fileService.queryInFolder(this.currentRoot ? this.currentRoot._id : null);
  }

  navigateUp() {
    if (this.currentRoot && !this.currentRoot.baseParentId) {
      this.currentRoot = null;
      this.canNavigateUp = false;
      this.updateFileElementQuery();
    } else {
      this.currentRoot = this.fileService.get(this.currentRoot.baseParentId);
      this.updateFileElementQuery();
    }
    this.currentPath = this.popFromPath(this.currentPath);
  }

  navigateToFolder(element: FileElement) {
    this.currentRoot = element;
    this.updateFileElementQuery();
    this.currentPath = this.pushToPath(this.currentPath, element.name);
    this.canNavigateUp = true;
  }

  pushToPath(path: string, folderName: string) {
    let p = path ? path : '';
    p += `${folderName}/`;
    return p;
  }

  popFromPath(path: string) {
    let p = path ? path : '';
    let split = p.split('/');
    split.splice(split.length - 2, 1);
    p = split.join('/');
    return p;
  }
}
