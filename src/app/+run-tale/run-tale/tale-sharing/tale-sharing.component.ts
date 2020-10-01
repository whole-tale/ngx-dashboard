import { ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnChanges, OnInit, Output } from '@angular/core';
import { ApiConfiguration } from '@api/api-configuration';
import { Group } from '@api/models/group';
import { Tale } from '@api/models/tale';
import { User } from '@api/models/user';
import { GroupService } from '@api/services/group.service';
import { TaleService } from '@api/services/tale.service';
import { UserService } from '@api/services/user.service';
import { BaseComponent } from '@framework/core';
import { LogService } from '@framework/core/log.service';
import { enterZone } from '@framework/ngrx/enter-zone.operator';
import { BehaviorSubject } from 'rxjs';

// import * as $ from 'jquery';
declare var $: any;

interface CollaboratorList {
  users: Array<Collaborator>,
  groups: Array<Collaborator>
}

interface Collaborator {
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
  selector: 'app-tale-sharing',
  templateUrl: './tale-sharing.component.html',
  styleUrls: ['./tale-sharing.component.scss']
})
export class TaleSharingComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() tale: Tale;
  @Input() creator: User;

  @Input() collaborators: CollaboratorList;
  @Output() collaboratorsChange: EventEmitter<CollaboratorList> = new EventEmitter<CollaboratorList>();
  displayedCollaborators: Array<Collaborator> = [];

  users: Array<any> = [];

  newCollabLogin = '';
  newCollabAccess = 0;
  newCollabUser: User;

  handleChange(evt: any, level: string) {
    const target = evt.target;
    if (!target.checked) {
      return;
    } else if (target.checked && level === 'public') {
      // Make Tale public
      this.tale.public = true;
    } else if (target.checked && level === 'private') {
      // Make Tale private
      this.tale.public = false;
    }

    this.taleService.taleUpdateTale({ id: this.tale._id, tale: this.tale }).subscribe((resp: any) => {
      this.logger.debug('Tale is now ' + this.tale.public ? 'public' : 'private');
    });
  }

  constructor(private zone: NgZone,
              private ref: ChangeDetectorRef,
              private config: ApiConfiguration,
              private logger: LogService,
              private groupService: GroupService,
              private taleService: TaleService,
              private userService: UserService) {
                super();
  }

  ngOnInit(): void {
    $('.ui.dropdown.access-dropdown').dropdown('activate');
  }

  getDisplayedCollaborators(collaborators: CollaboratorList) {
    const users = collaborators.users.filter(collab => collab.id !== this.tale.creatorId);
    return users.concat(collaborators.groups)
  }

  ngOnChanges(): void {
    const self = this;

    if (this.tale && this.tale.public) {
      $('#publicRadio').checkbox('check');
    } else if (this.tale && !this.tale.public) {
      $('#privateRadio').checkbox('check');
    }

    this.userService.userFind({}).subscribe((users: Array<User>) => {
      users.forEach((user: User) => {
        user.name = `${user.firstName} ${user.lastName}`;
      });
      this.users = users.filter(user => this.tale.creatorId !== user._id);

      // Initialize our user search
      $('#userSearch').search({
        source: this.users,
        type: 'standard',
        fullTextSearch: 'true',
        searchOnFocus: true,
        debug: true,
        verbose: true,
        minCharacters: 0,
        templates: {
          // Customize user search result template
          userSearch: (response: any, fields: any) => {
            //this.users = response.results;
            // returns results html for custom results
            let template = `<div class="ui relaxed divided list" style="padding:10px;">`
            response.results.forEach((result: User) => {
              template +=  `<a class="item clickable result">
                  <div class="image">
                    <img class="ui avatar image circular" src="${result[fields.image]}"></img>
                  </div>
                  <div class="content">
                    <div class="title">${result[fields.title]}</div>
                    <div class="description">${result[fields.description]}</div>
                  </div>
                </a>`
            })
            template += `</div>`
            return template;
          },
        },
        fields: {
          title: 'name',
          image: 'gravatar_baseUrl',
          description: 'login',
          displayField: 'name'
        },
        searchFields: [
          'login',
          'name',
          'email',
          'firstName',
          'lastName',
          'description',
        ],
        onSelect: function(result: any, response: any) {
          self.logger.debug('Selected:', result);

          // this.newCollabLogin = result.login;
          const displayName = result.login;
          $('#loginSearch').search('set value', displayName);
          //$('#loginSearch').find('input').val(displayName);
          $('#loginSearch').search('hide results');
          $('#loginInput').val(displayName);

          self.newCollabUser = result;
          self.ref.detectChanges();
          return true;
        }
      });

      this.ref.detectChanges();
    });

    // Initialize new collaborator access dropdown menu
    $('#new-collab-access-dropdown').dropdown({ action: (text: string, value: any) => {
      $('#new-collab-access-dropdown').dropdown('hide');
      $('#new-collab-access-dropdown').dropdown('set selected', value);
      this.newCollabAccess = value;
      this.ref.detectChanges();
    }});

    setTimeout(() => {
      // Initialize per-user collaborator access dropdown menus
      this.collaborators.users.forEach((collab: Collaborator) => {
        // Init the dropdown and set our action handler
        const selector = `#${collab.id}-access-dropdown`;
        this.initializeDropdown(selector, collab);

        // Fetch user for any additional metadata
        this.userService.userGetUser(collab.id).subscribe((resp: any) => {
          // FIXME: RxJS doesnt play well with Gravatar endpoint returning a 303
          // TODO: What to display if no user gravatar?
          collab.gravatar_baseUrl = resp.gravatar_baseUrl;
          this.ref.detectChanges();
        });
      });

      // Initialize per-group collaborator access dropdown menus
      this.collaborators.groups.forEach((collab: Collaborator) => {
        const selector = `#${collab.id}-access-dropdown`;
        this.initializeDropdown(selector, collab);

        // Fetch group for any additional metadata
        this.groupService.groupGetGroup(collab.id).subscribe((group: Group) => {
          // TODO: What to display for group avatar?
          collab.affiliation = group.description;
          this.ref.detectChanges();
        });
      });
    }, 500);
  }

  // Init the dropdown and set our action handler
  initializeDropdown(selector: string, collab: Collaborator) {
    this.logger.debug(`Activating ${selector}`);
    $(selector).dropdown({ action: (text: string, value: any) => {
      $(selector).dropdown('hide');
      $(selector).dropdown('set selected', value);
      collab.level = +value;
      this.saveCollaborators();
    }});

    // Set default dropdown value based on current access level
    $(selector).dropdown('set selected', collab.level);
  }

  addCollaborator() {
    const collab = {
      id: this.newCollabUser._id,
      level: +this.newCollabAccess,
      login: this.newCollabLogin,
      name: this.newCollabUser.name,
      showAlert: true,
      description: this.newCollabUser.description,
      gravatar_baseUrl: this.newCollabUser.gravatar_baseUrl,
    };
    this.collaborators.users.push(collab);

    this.saveCollaborators().then(resp => {
      this.clearNewCollaborator();
      this.ref.detectChanges();
      setTimeout(() => {
        const selector = `#${collab.id}-access-dropdown`;
        this.initializeDropdown(selector, collab);
      });
    });

    // TODO: Handle failure

  }

  removeCollaborator(id: string) {
    const user = this.collaborators.users.find((c) => id === c.id);
    if (user) {
      const index = this.collaborators.users.indexOf(user);
      this.collaborators.users.splice(index, 1);
    } else {
      this.logger.warn(`Failed to find user with id=${id}.. checking for group`);
      const group = this.collaborators.groups.find((c) => id === c.id);
      if (group) {
        const index = this.collaborators.groups.indexOf(group);
        this.collaborators.groups.splice(index, 1);
      } else {
        this.logger.error(`Failed to find group with id=${id}`);
      }
    }

    this.saveCollaborators();
  }

  saveCollaborators(): Promise<any> {
    const params = {
      id: this.tale._id,
      access: JSON.stringify(this.collaborators)
    };

    let promise = this.taleService.taleUpdateTaleAccess(params).toPromise();
    promise.then((response: any) => {
      this.logger.debug('Tale access updated successfully:', response);
    });
    return promise;
  }

  clearNewCollaborator() {
    $('#loginSearch').search('set value', '');
    this.newCollabLogin = '';
    this.newCollabAccess = 1;
    this.newCollabUser = null;
  }

  trackById(index: number, user: any): string {
    return user._id;
  }
}
