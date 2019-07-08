/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
class GroupService extends __BaseService {
  static readonly groupFindPath = '/group';
  static readonly groupCreateGroupPath = '/group';
  static readonly groupDeleteGroupPath = '/group/{id}';
  static readonly groupGetGroupPath = '/group/{id}';
  static readonly groupUpdateGroupPath = '/group/{id}';
  static readonly groupGetGroupAccessPath = '/group/{id}/access';
  static readonly groupDemoteAdminPath = '/group/{id}/admin';
  static readonly groupPromoteToAdminPath = '/group/{id}/admin';
  static readonly groupGetGroupInvitationsPath = '/group/{id}/invitation';
  static readonly groupInviteToGroupPath = '/group/{id}/invitation';
  static readonly groupRemoveFromGroupPath = '/group/{id}/member';
  static readonly groupListMembersPath = '/group/{id}/member';
  static readonly groupJoinGroupPath = '/group/{id}/member';
  static readonly groupDemoteModPath = '/group/{id}/moderator';
  static readonly groupPromoteToModeratorPath = '/group/{id}/moderator';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }

  /**
   * @param params The `GroupService.GroupFindParams` containing the following parameters:
   *
   * - `text`: Pass this to perform a full-text search for groups.
   *
   * - `sortdir`: Sort order: 1 for ascending, -1 for descending.
   *
   * - `sort`: Field to sort the result set by.
   *
   * - `offset`: Offset into result set.
   *
   * - `limit`: Result set size limit.
   *
   * - `exact`: If true, only return exact name matches. This is case sensitive.
   */
  groupFindResponse(params: GroupService.GroupFindParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.text != null) __params = __params.set('text', params.text.toString());
    if (params.sortdir != null) __params = __params.set('sortdir', params.sortdir.toString());
    if (params.sort != null) __params = __params.set('sort', params.sort.toString());
    if (params.offset != null) __params = __params.set('offset', params.offset.toString());
    if (params.limit != null) __params = __params.set('limit', params.limit.toString());
    if (params.exact != null) __params = __params.set('exact', params.exact.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/group`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json'
    });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map(_r => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * @param params The `GroupService.GroupFindParams` containing the following parameters:
   *
   * - `text`: Pass this to perform a full-text search for groups.
   *
   * - `sortdir`: Sort order: 1 for ascending, -1 for descending.
   *
   * - `sort`: Field to sort the result set by.
   *
   * - `offset`: Offset into result set.
   *
   * - `limit`: Result set size limit.
   *
   * - `exact`: If true, only return exact name matches. This is case sensitive.
   */
  groupFind(params: GroupService.GroupFindParams): __Observable<null> {
    return this.groupFindResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * Must be logged in.
   * @param params The `GroupService.GroupCreateGroupParams` containing the following parameters:
   *
   * - `name`: Unique name for the group.
   *
   * - `public`: Whether the group should be publicly visible.
   *
   * - `description`: Description of the group.
   */
  groupCreateGroupResponse(params: GroupService.GroupCreateGroupParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.name != null) __params = __params.set('name', params.name.toString());
    if (params.public != null) __params = __params.set('public', params.public.toString());
    if (params.description != null) __params = __params.set('description', params.description.toString());
    let req = new HttpRequest<any>('POST', this.rootUrl + `/group`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json'
    });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map(_r => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * Must be logged in.
   * @param params The `GroupService.GroupCreateGroupParams` containing the following parameters:
   *
   * - `name`: Unique name for the group.
   *
   * - `public`: Whether the group should be publicly visible.
   *
   * - `description`: Description of the group.
   */
  groupCreateGroup(params: GroupService.GroupCreateGroupParams): __Observable<null> {
    return this.groupCreateGroupResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the document.
   */
  groupDeleteGroupResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('DELETE', this.rootUrl + `/group/${id}`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json'
    });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map(_r => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * @param id The ID of the document.
   */
  groupDeleteGroup(id: string): __Observable<null> {
    return this.groupDeleteGroupResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the document.
   */
  groupGetGroupResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('GET', this.rootUrl + `/group/${id}`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json'
    });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map(_r => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * @param id The ID of the document.
   */
  groupGetGroup(id: string): __Observable<null> {
    return this.groupGetGroupResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `GroupService.GroupUpdateGroupParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `public`: Whether the group should be publicly visible
   *
   * - `name`: The name to set on the group.
   *
   * - `description`: Description for the group.
   *
   * - `addAllowed`: Can admins or moderators directly add members to this group?  Only system administrators are allowed to set this field
   */
  groupUpdateGroupResponse(params: GroupService.GroupUpdateGroupParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.public != null) __params = __params.set('public', params.public.toString());
    if (params.name != null) __params = __params.set('name', params.name.toString());
    if (params.description != null) __params = __params.set('description', params.description.toString());
    if (params.addAllowed != null) __params = __params.set('addAllowed', params.addAllowed.toString());
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/group/${params.id}`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json'
    });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map(_r => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * @param params The `GroupService.GroupUpdateGroupParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `public`: Whether the group should be publicly visible
   *
   * - `name`: The name to set on the group.
   *
   * - `description`: Description for the group.
   *
   * - `addAllowed`: Can admins or moderators directly add members to this group?  Only system administrators are allowed to set this field
   */
  groupUpdateGroup(params: GroupService.GroupUpdateGroupParams): __Observable<null> {
    return this.groupUpdateGroupResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the document.
   */
  groupGetGroupAccessResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('GET', this.rootUrl + `/group/${id}/access`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json'
    });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map(_r => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * @param id The ID of the document.
   */
  groupGetGroupAccess(id: string): __Observable<null> {
    return this.groupGetGroupAccessResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `GroupService.GroupDemoteAdminParams` containing the following parameters:
   *
   * - `userId`: The ID of the user to demote.
   *
   * - `id`: The ID of the document.
   */
  groupDemoteAdminResponse(params: GroupService.GroupDemoteAdminParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __headers.append('Content-Type', 'multipart/form-data');
    let __formData = new FormData();
    __body = __formData;
    if (params.userId !== null && typeof params.userId !== 'undefined') {
      __formData.append('userId', params.userId as string | Blob);
    }

    let req = new HttpRequest<any>('DELETE', this.rootUrl + `/group/${params.id}/admin`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json'
    });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map(_r => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * @param params The `GroupService.GroupDemoteAdminParams` containing the following parameters:
   *
   * - `userId`: The ID of the user to demote.
   *
   * - `id`: The ID of the document.
   */
  groupDemoteAdmin(params: GroupService.GroupDemoteAdminParams): __Observable<null> {
    return this.groupDemoteAdminResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `GroupService.GroupPromoteToAdminParams` containing the following parameters:
   *
   * - `userId`: The ID of the user to promote.
   *
   * - `id`: The ID of the document.
   */
  groupPromoteToAdminResponse(params: GroupService.GroupPromoteToAdminParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __headers.append('Content-Type', 'multipart/form-data');
    let __formData = new FormData();
    __body = __formData;
    if (params.userId !== null && typeof params.userId !== 'undefined') {
      __formData.append('userId', params.userId as string | Blob);
    }

    let req = new HttpRequest<any>('POST', this.rootUrl + `/group/${params.id}/admin`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json'
    });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map(_r => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * @param params The `GroupService.GroupPromoteToAdminParams` containing the following parameters:
   *
   * - `userId`: The ID of the user to promote.
   *
   * - `id`: The ID of the document.
   */
  groupPromoteToAdmin(params: GroupService.GroupPromoteToAdminParams): __Observable<null> {
    return this.groupPromoteToAdminResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `GroupService.GroupGetGroupInvitationsParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `sortdir`: Sort order: 1 for ascending, -1 for descending.
   *
   * - `sort`: Field to sort the result set by.
   *
   * - `offset`: Offset into result set.
   *
   * - `limit`: Result set size limit.
   */
  groupGetGroupInvitationsResponse(params: GroupService.GroupGetGroupInvitationsParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.sortdir != null) __params = __params.set('sortdir', params.sortdir.toString());
    if (params.sort != null) __params = __params.set('sort', params.sort.toString());
    if (params.offset != null) __params = __params.set('offset', params.offset.toString());
    if (params.limit != null) __params = __params.set('limit', params.limit.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/group/${params.id}/invitation`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json'
    });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map(_r => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * @param params The `GroupService.GroupGetGroupInvitationsParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `sortdir`: Sort order: 1 for ascending, -1 for descending.
   *
   * - `sort`: Field to sort the result set by.
   *
   * - `offset`: Offset into result set.
   *
   * - `limit`: Result set size limit.
   */
  groupGetGroupInvitations(params: GroupService.GroupGetGroupInvitationsParams): __Observable<null> {
    return this.groupGetGroupInvitationsResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * The "force" option to this endpoint is only available to administrators and can be used to bypass the invitation process and instead add the user directly to the group.
   * @param params The `GroupService.GroupInviteToGroupParams` containing the following parameters:
   *
   * - `userId`: The ID of the user to invite or accept.
   *
   * - `id`: The ID of the document.
   *
   * - `quiet`: If you do not want this action to send an email to the target user, set this to true.
   *
   * - `level`: The access level the user will be given when they accept the invitation.
   *
   * - `force`: Add user directly rather than sending an invitation (admin-only option).
   */
  groupInviteToGroupResponse(params: GroupService.GroupInviteToGroupParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __headers.append('Content-Type', 'multipart/form-data');
    let __formData = new FormData();
    __body = __formData;
    if (params.userId !== null && typeof params.userId !== 'undefined') {
      __formData.append('userId', params.userId as string | Blob);
    }

    if (params.quiet != null) __params = __params.set('quiet', params.quiet.toString());
    if (params.level != null) __params = __params.set('level', params.level.toString());
    if (params.force != null) __params = __params.set('force', params.force.toString());
    let req = new HttpRequest<any>('POST', this.rootUrl + `/group/${params.id}/invitation`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json'
    });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map(_r => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * The "force" option to this endpoint is only available to administrators and can be used to bypass the invitation process and instead add the user directly to the group.
   * @param params The `GroupService.GroupInviteToGroupParams` containing the following parameters:
   *
   * - `userId`: The ID of the user to invite or accept.
   *
   * - `id`: The ID of the document.
   *
   * - `quiet`: If you do not want this action to send an email to the target user, set this to true.
   *
   * - `level`: The access level the user will be given when they accept the invitation.
   *
   * - `force`: Add user directly rather than sending an invitation (admin-only option).
   */
  groupInviteToGroup(params: GroupService.GroupInviteToGroupParams): __Observable<null> {
    return this.groupInviteToGroupResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * If the specified user is not yet a member of the group, this will delete any outstanding invitation or membership request for the user. Passing no userId parameter will assume that the current user is removing themself.
   * @param params The `GroupService.GroupRemoveFromGroupParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `userId`: The ID of the user to remove. If not passed, will remove yourself from the group.
   */
  groupRemoveFromGroupResponse(params: GroupService.GroupRemoveFromGroupParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __headers.append('Content-Type', 'multipart/form-data');
    let __formData = new FormData();
    __body = __formData;

    if (params.userId !== null && typeof params.userId !== 'undefined') {
      __formData.append('userId', params.userId as string | Blob);
    }
    let req = new HttpRequest<any>('DELETE', this.rootUrl + `/group/${params.id}/member`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json'
    });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map(_r => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * If the specified user is not yet a member of the group, this will delete any outstanding invitation or membership request for the user. Passing no userId parameter will assume that the current user is removing themself.
   * @param params The `GroupService.GroupRemoveFromGroupParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `userId`: The ID of the user to remove. If not passed, will remove yourself from the group.
   */
  groupRemoveFromGroup(params: GroupService.GroupRemoveFromGroupParams): __Observable<null> {
    return this.groupRemoveFromGroupResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `GroupService.GroupListMembersParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `sortdir`: Sort order: 1 for ascending, -1 for descending.
   *
   * - `sort`: Field to sort the result set by.
   *
   * - `offset`: Offset into result set.
   *
   * - `limit`: Result set size limit.
   */
  groupListMembersResponse(params: GroupService.GroupListMembersParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.sortdir != null) __params = __params.set('sortdir', params.sortdir.toString());
    if (params.sort != null) __params = __params.set('sort', params.sort.toString());
    if (params.offset != null) __params = __params.set('offset', params.offset.toString());
    if (params.limit != null) __params = __params.set('limit', params.limit.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/group/${params.id}/member`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json'
    });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map(_r => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * @param params The `GroupService.GroupListMembersParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `sortdir`: Sort order: 1 for ascending, -1 for descending.
   *
   * - `sort`: Field to sort the result set by.
   *
   * - `offset`: Offset into result set.
   *
   * - `limit`: Result set size limit.
   */
  groupListMembers(params: GroupService.GroupListMembersParams): __Observable<null> {
    return this.groupListMembersResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the document.
   */
  groupJoinGroupResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('POST', this.rootUrl + `/group/${id}/member`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json'
    });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map(_r => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * @param id The ID of the document.
   */
  groupJoinGroup(id: string): __Observable<null> {
    return this.groupJoinGroupResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `GroupService.GroupDemoteModParams` containing the following parameters:
   *
   * - `userId`: The ID of the user to demote.
   *
   * - `id`: The ID of the document.
   */
  groupDemoteModResponse(params: GroupService.GroupDemoteModParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __headers.append('Content-Type', 'multipart/form-data');
    let __formData = new FormData();
    __body = __formData;
    if (params.userId !== null && typeof params.userId !== 'undefined') {
      __formData.append('userId', params.userId as string | Blob);
    }

    let req = new HttpRequest<any>('DELETE', this.rootUrl + `/group/${params.id}/moderator`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json'
    });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map(_r => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * @param params The `GroupService.GroupDemoteModParams` containing the following parameters:
   *
   * - `userId`: The ID of the user to demote.
   *
   * - `id`: The ID of the document.
   */
  groupDemoteMod(params: GroupService.GroupDemoteModParams): __Observable<null> {
    return this.groupDemoteModResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `GroupService.GroupPromoteToModeratorParams` containing the following parameters:
   *
   * - `userId`: The ID of the user to promote.
   *
   * - `id`: The ID of the document.
   */
  groupPromoteToModeratorResponse(params: GroupService.GroupPromoteToModeratorParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __headers.append('Content-Type', 'multipart/form-data');
    let __formData = new FormData();
    __body = __formData;
    if (params.userId !== null && typeof params.userId !== 'undefined') {
      __formData.append('userId', params.userId as string | Blob);
    }

    let req = new HttpRequest<any>('POST', this.rootUrl + `/group/${params.id}/moderator`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json'
    });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map(_r => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * @param params The `GroupService.GroupPromoteToModeratorParams` containing the following parameters:
   *
   * - `userId`: The ID of the user to promote.
   *
   * - `id`: The ID of the document.
   */
  groupPromoteToModerator(params: GroupService.GroupPromoteToModeratorParams): __Observable<null> {
    return this.groupPromoteToModeratorResponse(params).pipe(__map(_r => _r.body as null));
  }
}

module GroupService {
  /**
   * Parameters for groupFind
   */
  export interface GroupFindParams {
    /**
     * Pass this to perform a full-text search for groups.
     */
    text?: string;

    /**
     * Sort order: 1 for ascending, -1 for descending.
     */
    sortdir?: 1 | -1;

    /**
     * Field to sort the result set by.
     */
    sort?: string;

    /**
     * Offset into result set.
     */
    offset?: number;

    /**
     * Result set size limit.
     */
    limit?: number;

    /**
     * If true, only return exact name matches. This is case sensitive.
     */
    exact?: boolean;
  }

  /**
   * Parameters for groupCreateGroup
   */
  export interface GroupCreateGroupParams {
    /**
     * Unique name for the group.
     */
    name: string;

    /**
     * Whether the group should be publicly visible.
     */
    public?: boolean;

    /**
     * Description of the group.
     */
    description?: string;
  }

  /**
   * Parameters for groupUpdateGroup
   */
  export interface GroupUpdateGroupParams {
    /**
     * The ID of the document.
     */
    id: string;

    /**
     * Whether the group should be publicly visible
     */
    public?: boolean;

    /**
     * The name to set on the group.
     */
    name?: string;

    /**
     * Description for the group.
     */
    description?: string;

    /**
     * Can admins or moderators directly add members to this group?  Only system administrators are allowed to set this field
     */
    addAllowed?: 'default' | 'no' | 'yesmod' | 'yesadmin';
  }

  /**
   * Parameters for groupDemoteAdmin
   */
  export interface GroupDemoteAdminParams {
    /**
     * The ID of the user to demote.
     */
    userId: string;

    /**
     * The ID of the document.
     */
    id: string;
  }

  /**
   * Parameters for groupPromoteToAdmin
   */
  export interface GroupPromoteToAdminParams {
    /**
     * The ID of the user to promote.
     */
    userId: string;

    /**
     * The ID of the document.
     */
    id: string;
  }

  /**
   * Parameters for groupGetGroupInvitations
   */
  export interface GroupGetGroupInvitationsParams {
    /**
     * The ID of the document.
     */
    id: string;

    /**
     * Sort order: 1 for ascending, -1 for descending.
     */
    sortdir?: 1 | -1;

    /**
     * Field to sort the result set by.
     */
    sort?: string;

    /**
     * Offset into result set.
     */
    offset?: number;

    /**
     * Result set size limit.
     */
    limit?: number;
  }

  /**
   * Parameters for groupInviteToGroup
   */
  export interface GroupInviteToGroupParams {
    /**
     * The ID of the user to invite or accept.
     */
    userId: string;

    /**
     * The ID of the document.
     */
    id: string;

    /**
     * If you do not want this action to send an email to the target user, set this to true.
     */
    quiet?: boolean;

    /**
     * The access level the user will be given when they accept the invitation.
     */
    level?: number;

    /**
     * Add user directly rather than sending an invitation (admin-only option).
     */
    force?: boolean;
  }

  /**
   * Parameters for groupRemoveFromGroup
   */
  export interface GroupRemoveFromGroupParams {
    /**
     * The ID of the document.
     */
    id: string;

    /**
     * The ID of the user to remove. If not passed, will remove yourself from the group.
     */
    userId?: string;
  }

  /**
   * Parameters for groupListMembers
   */
  export interface GroupListMembersParams {
    /**
     * The ID of the document.
     */
    id: string;

    /**
     * Sort order: 1 for ascending, -1 for descending.
     */
    sortdir?: 1 | -1;

    /**
     * Field to sort the result set by.
     */
    sort?: string;

    /**
     * Offset into result set.
     */
    offset?: number;

    /**
     * Result set size limit.
     */
    limit?: number;
  }

  /**
   * Parameters for groupDemoteMod
   */
  export interface GroupDemoteModParams {
    /**
     * The ID of the user to demote.
     */
    userId: string;

    /**
     * The ID of the document.
     */
    id: string;
  }

  /**
   * Parameters for groupPromoteToModerator
   */
  export interface GroupPromoteToModeratorParams {
    /**
     * The ID of the user to promote.
     */
    userId: string;

    /**
     * The ID of the document.
     */
    id: string;
  }
}

export { GroupService };
