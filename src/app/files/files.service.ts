import { Injectable } from '@angular/core';

import { FileElement } from '@files/models/file-element';
import { BehaviorSubject, Observable } from 'rxjs';
import { v4 } from 'uuid';

interface IFileService {
  add(fileElement: FileElement): FileElement;
  delete(id: string): void;
  update(id: string, update: Partial<FileElement>): void;
  queryInFolder(folderId: string): Observable<Array<FileElement>>;
  get(id: string): FileElement;
}

@Injectable({
  providedIn: 'root'
})
export class FilesService implements IFileService {
  private readonly map = new Map<string, FileElement>();

  private querySubject: BehaviorSubject<Array<FileElement>>;

  constructor() {
    this.pushMockData();
  }

  createFileElement(id: string, name: string, _modelType = 'folder', baseParentId: string = null) {
    const now = new Date();
    const e = new FileElement();
    e._id = id;
    e._modelType = _modelType;
    e.created = e.updated = now;
    e.description = '';
    e.size = 0;
    e.baseParentType = e.parentCollection = 'user';
    e.baseParentId = baseParentId;
    e.name = name;
    return e;
  }

  pushMockData() {
    const root = this.createFileElement('12345', 'root');
    const file1 = this.createFileElement('11111', 'file 1', 'file', root._id);
    const file2 = this.createFileElement('22222', 'file 2', 'file', root._id);
    const folder1 = this.createFileElement('11', 'folder 1', 'folder', root._id);
    const file3 = this.createFileElement('33333', 'level2-file3', 'file', folder1._id);
    const folder2 = this.createFileElement('22', 'level2-folder2', 'folder', folder1._id);
    const file4 = this.createFileElement('44444', 'level3-file4', 'file', folder2._id);

    this.map.set(root._id, root);
    this.map.set(file1._id, file1);
    this.map.set(file2._id, file2);
    this.map.set(file3._id, file3);
    this.map.set(file4._id, file4);
    this.map.set(folder1._id, folder1);
    this.map.set(folder2._id, folder2);
  }

  getRootFolderId() {
    return '12345';
  }

  add(fileElement: FileElement) {
    fileElement._id = v4();
    this.map.set(fileElement._id, this.clone(fileElement));
    return fileElement;
  }

  delete(id: string) {
    this.map.delete(id);
  }

  update(id: string, update: Partial<FileElement>) {
    let element = this.map.get(id);
    element = { ...element, ...update };
    this.map.set(element._id, element);
  }
  queryInFolder(folderId: string) {
    const result: Array<FileElement> = [];
    this.map.forEach(element => {
      if (element.baseParentId === folderId) {
        result.push(this.clone(element));
      }
    });
    if (!this.querySubject) {
      this.querySubject = new BehaviorSubject(result);
    } else {
      this.querySubject.next(result);
    }
    return this.querySubject.asObservable();
  }

  get(id: string) {
    return this.map.get(id);
  }

  clone(element: FileElement) {
    return JSON.parse(JSON.stringify(element));
  }
}
