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
class SystemService extends __BaseService {
  static readonly systemGetAccessFlagsPath = '/system/access_flag';
  static readonly systemSystemStatusPath = '/system/check';
  static readonly systemSystemConsistencyCheckPath = '/system/check';
  static readonly systemGetConfigurationOptionPath = '/system/configuration';
  static readonly systemGetLogPath = '/system/log';
  static readonly systemGetLogLevelPath = '/system/log/level';
  static readonly systemSetLogLevelPath = '/system/log/level';
  static readonly systemGetPluginsPath = '/system/plugins';
  static readonly systemEnablePluginsPath = '/system/plugins';
  static readonly systemRestartServerPath = '/system/restart';
  static readonly systemUnsetSettingPath = '/system/setting';
  static readonly systemGetSettingPath = '/system/setting';
  static readonly systemSetSettingPath = '/system/setting';
  static readonly systemGetCollectionCreationPolicyAccessPath = '/system/setting/collection_creation_policy/access';
  static readonly systemDiscardPartialUploadsPath = '/system/uploads';
  static readonly systemGetPartialUploadsPath = '/system/uploads';
  static readonly systemGetVersionPath = '/system/version';
  static readonly systemBuildWebCodePath = '/system/web_build';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }
  systemGetAccessFlagsResponse(): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + `/system/access_flag`, __body, {
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
  systemGetAccessFlags(): __Observable<null> {
    return this.systemGetAccessFlagsResponse().pipe(__map(_r => _r.body as null));
  }

  /**
   * Must be a system administrator to call this with any mode other than basic.
   * @param mode Select details to return. "quick" are the details that can be answered without much load on the system. "slow" also includes some resource-intensive queries.
   */
  systemSystemStatusResponse(mode?: 'basic' | 'quick' | 'slow'): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (mode != null) __params = __params.set('mode', mode.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/system/check`, __body, {
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
   * Must be a system administrator to call this with any mode other than basic.
   * @param mode Select details to return. "quick" are the details that can be answered without much load on the system. "slow" also includes some resource-intensive queries.
   */
  systemSystemStatus(mode?: 'basic' | 'quick' | 'slow'): __Observable<null> {
    return this.systemSystemStatusResponse(mode).pipe(__map(_r => _r.body as null));
  }

  /**
   * Must be a system administrator to call this.  This verifies and corrects some issues, such as incorrect folder sizes.
   * @param progress Whether to record progress on this task.
   */
  systemSystemConsistencyCheckResponse(progress?: boolean): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (progress != null) __params = __params.set('progress', progress.toString());
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/system/check`, __body, {
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
   * Must be a system administrator to call this.  This verifies and corrects some issues, such as incorrect folder sizes.
   * @param progress Whether to record progress on this task.
   */
  systemSystemConsistencyCheck(progress?: boolean): __Observable<null> {
    return this.systemSystemConsistencyCheckResponse(progress).pipe(__map(_r => _r.body as null));
  }

  /**
   * Must be a system administrator to call this.
   * @param params The `SystemService.SystemGetConfigurationOptionParams` containing the following parameters:
   *
   * - `section`: The section identifying the configuration option.
   *
   * - `key`: The key identifying the configuration option.
   */
  systemGetConfigurationOptionResponse(params: SystemService.SystemGetConfigurationOptionParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.section != null) __params = __params.set('section', params.section.toString());
    if (params.key != null) __params = __params.set('key', params.key.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/system/configuration`, __body, {
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
   * Must be a system administrator to call this.
   * @param params The `SystemService.SystemGetConfigurationOptionParams` containing the following parameters:
   *
   * - `section`: The section identifying the configuration option.
   *
   * - `key`: The key identifying the configuration option.
   */
  systemGetConfigurationOption(params: SystemService.SystemGetConfigurationOptionParams): __Observable<null> {
    return this.systemGetConfigurationOptionResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * Must be a system administrator to call this.
   * @param params The `SystemService.SystemGetLogParams` containing the following parameters:
   *
   * - `log`: Which log to tail.
   *
   * - `bytes`: Controls how many bytes (from the end of the log) to show. Pass 0 to show the whole log.
   */
  systemGetLogResponse(params: SystemService.SystemGetLogParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.log != null) __params = __params.set('log', params.log.toString());
    if (params.bytes != null) __params = __params.set('bytes', params.bytes.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/system/log`, __body, {
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
   * Must be a system administrator to call this.
   * @param params The `SystemService.SystemGetLogParams` containing the following parameters:
   *
   * - `log`: Which log to tail.
   *
   * - `bytes`: Controls how many bytes (from the end of the log) to show. Pass 0 to show the whole log.
   */
  systemGetLog(params: SystemService.SystemGetLogParams): __Observable<null> {
    return this.systemGetLogResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * Must be a system administrator to call this.
   */
  systemGetLogLevelResponse(): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + `/system/log/level`, __body, {
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
   * Must be a system administrator to call this.
   */
  systemGetLogLevel(): __Observable<null> {
    return this.systemGetLogLevelResponse().pipe(__map(_r => _r.body as null));
  }

  /**
   * Must be a system administrator to call this.
   * @param level The new level to set.
   */
  systemSetLogLevelResponse(level: 'CRITICAL' | 'ERROR' | 'WARNING' | 'INFO' | 'DEBUG'): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (level != null) __params = __params.set('level', level.toString());
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/system/log/level`, __body, {
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
   * Must be a system administrator to call this.
   * @param level The new level to set.
   */
  systemSetLogLevel(level: 'CRITICAL' | 'ERROR' | 'WARNING' | 'INFO' | 'DEBUG'): __Observable<null> {
    return this.systemSetLogLevelResponse(level).pipe(__map(_r => _r.body as null));
  }

  /**
   * Must be a system administrator to call this.
   */
  systemGetPluginsResponse(): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + `/system/plugins`, __body, {
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
   * Must be a system administrator to call this.
   */
  systemGetPlugins(): __Observable<null> {
    return this.systemGetPluginsResponse().pipe(__map(_r => _r.body as null));
  }

  /**
   * Must be a system administrator to call this.
   * @param plugins JSON array of plugins to enable.
   */
  systemEnablePluginsResponse(plugins: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (plugins != null) __params = __params.set('plugins', plugins.toString());
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/system/plugins`, __body, {
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
   * Must be a system administrator to call this.
   * @param plugins JSON array of plugins to enable.
   */
  systemEnablePlugins(plugins: string): __Observable<null> {
    return this.systemEnablePluginsResponse(plugins).pipe(__map(_r => _r.body as null));
  }

  /**
   * Must be a system administrator to call this.
   */
  systemRestartServerResponse(): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/system/restart`, __body, {
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
   * Must be a system administrator to call this.
   */
  systemRestartServer(): __Observable<null> {
    return this.systemRestartServerResponse().pipe(__map(_r => _r.body as null));
  }

  /**
   * Must be a system administrator to call this. This is used to explicitly restore a setting to its default value.
   * @param key The key identifying the setting to unset.
   */
  systemUnsetSettingResponse(key: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (key != null) __params = __params.set('key', key.toString());
    let req = new HttpRequest<any>('DELETE', this.rootUrl + `/system/setting`, __body, {
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
   * Must be a system administrator to call this. This is used to explicitly restore a setting to its default value.
   * @param key The key identifying the setting to unset.
   */
  systemUnsetSetting(key: string): __Observable<null> {
    return this.systemUnsetSettingResponse(key).pipe(__map(_r => _r.body as null));
  }

  /**
   * Must be a system administrator to call this.
   * @param params The `SystemService.SystemGetSettingParams` containing the following parameters:
   *
   * - `list`: A JSON list of keys representing a set of settings to return.
   *
   * - `key`: The key identifying this setting.
   *
   * - `default`: If "none", return a null value if a setting is currently the default value. If "default", return the default value of the setting(s).
   */
  systemGetSettingResponse(params: SystemService.SystemGetSettingParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.list != null) __params = __params.set('list', params.list.toString());
    if (params.key != null) __params = __params.set('key', params.key.toString());
    if (params.default != null) __params = __params.set('default', params.default.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/system/setting`, __body, {
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
   * Must be a system administrator to call this.
   * @param params The `SystemService.SystemGetSettingParams` containing the following parameters:
   *
   * - `list`: A JSON list of keys representing a set of settings to return.
   *
   * - `key`: The key identifying this setting.
   *
   * - `default`: If "none", return a null value if a setting is currently the default value. If "default", return the default value of the setting(s).
   */
  systemGetSetting(params: SystemService.SystemGetSettingParams): __Observable<null> {
    return this.systemGetSettingResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * Must be a system administrator to call this. If the value passed is a valid JSON object, it will be parsed and stored as an object.
   * @param params The `SystemService.SystemSetSettingParams` containing the following parameters:
   *
   * - `value`: The value for this setting.
   *
   * - `list`: A JSON list of objects with key and value representing a list of settings to set.
   *
   * - `key`: The key identifying this setting.
   */
  systemSetSettingResponse(params: SystemService.SystemSetSettingParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.value != null) __params = __params.set('value', params.value.toString());
    if (params.list != null) __params = __params.set('list', params.list.toString());
    if (params.key != null) __params = __params.set('key', params.key.toString());
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/system/setting`, __body, {
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
   * Must be a system administrator to call this. If the value passed is a valid JSON object, it will be parsed and stored as an object.
   * @param params The `SystemService.SystemSetSettingParams` containing the following parameters:
   *
   * - `value`: The value for this setting.
   *
   * - `list`: A JSON list of objects with key and value representing a list of settings to set.
   *
   * - `key`: The key identifying this setting.
   */
  systemSetSetting(params: SystemService.SystemSetSettingParams): __Observable<null> {
    return this.systemSetSettingResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * Get result in the same structure as the access endpoints of collection, file, and group
   */
  systemGetCollectionCreationPolicyAccessResponse(): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + `/system/setting/collection_creation_policy/access`, __body, {
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
   * Get result in the same structure as the access endpoints of collection, file, and group
   */
  systemGetCollectionCreationPolicyAccess(): __Observable<null> {
    return this.systemGetCollectionCreationPolicyAccessResponse().pipe(__map(_r => _r.body as null));
  }

  /**
   * Must be a system administrator to call this. This frees resources that were allocated for the uploads and clears the uploads from database.
   * @param params The `SystemService.SystemDiscardPartialUploadsParams` containing the following parameters:
   *
   * - `userId`: Restrict clearing uploads to those started by a specific user.
   *
   * - `uploadId`: Clear only a specific upload.
   *
   * - `parentId`: Restrict clearing uploads to those within a specific folder or item.
   *
   * - `minimumAge`: Restrict clearing uploads to those that are at least this many days old.
   *
   * - `includeUntracked`: Some assetstores can have partial uploads that are no longer in the Girder database.  If this is True, remove all of them (only filtered by assetstoreId).
   *
   * - `assetstoreId`: Restrict clearing uploads within a specific assetstore.
   */
  systemDiscardPartialUploadsResponse(params: SystemService.SystemDiscardPartialUploadsParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.userId != null) __params = __params.set('userId', params.userId.toString());
    if (params.uploadId != null) __params = __params.set('uploadId', params.uploadId.toString());
    if (params.parentId != null) __params = __params.set('parentId', params.parentId.toString());
    if (params.minimumAge != null) __params = __params.set('minimumAge', params.minimumAge.toString());
    if (params.includeUntracked != null) __params = __params.set('includeUntracked', params.includeUntracked.toString());
    if (params.assetstoreId != null) __params = __params.set('assetstoreId', params.assetstoreId.toString());
    let req = new HttpRequest<any>('DELETE', this.rootUrl + `/system/uploads`, __body, {
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
   * Must be a system administrator to call this. This frees resources that were allocated for the uploads and clears the uploads from database.
   * @param params The `SystemService.SystemDiscardPartialUploadsParams` containing the following parameters:
   *
   * - `userId`: Restrict clearing uploads to those started by a specific user.
   *
   * - `uploadId`: Clear only a specific upload.
   *
   * - `parentId`: Restrict clearing uploads to those within a specific folder or item.
   *
   * - `minimumAge`: Restrict clearing uploads to those that are at least this many days old.
   *
   * - `includeUntracked`: Some assetstores can have partial uploads that are no longer in the Girder database.  If this is True, remove all of them (only filtered by assetstoreId).
   *
   * - `assetstoreId`: Restrict clearing uploads within a specific assetstore.
   */
  systemDiscardPartialUploads(params: SystemService.SystemDiscardPartialUploadsParams): __Observable<null> {
    return this.systemDiscardPartialUploadsResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * Must be a system administrator to call this.
   * @param params The `SystemService.SystemGetPartialUploadsParams` containing the following parameters:
   *
   * - `userId`: Restrict listing uploads to those started by a specific user.
   *
   * - `uploadId`: List only a specific upload.
   *
   * - `sortdir`: Sort order: 1 for ascending, -1 for descending.
   *
   * - `sort`: Field to sort the result set by.
   *
   * - `parentId`: Restrict listing uploads to those within a specific folder or item.
   *
   * - `offset`: Offset into result set.
   *
   * - `minimumAge`: Restrict listing uploads to those that are at least this many days old.
   *
   * - `limit`: Result set size limit.
   *
   * - `includeUntracked`: Some assetstores can have partial uploads that are no longer in the Girder database.  If this is True, include all of them (only filtered by assetstoreId) in the result list.
   *
   * - `assetstoreId`: Restrict listing uploads within a specific assetstore.
   */
  systemGetPartialUploadsResponse(params: SystemService.SystemGetPartialUploadsParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.userId != null) __params = __params.set('userId', params.userId.toString());
    if (params.uploadId != null) __params = __params.set('uploadId', params.uploadId.toString());
    if (params.sortdir != null) __params = __params.set('sortdir', params.sortdir.toString());
    if (params.sort != null) __params = __params.set('sort', params.sort.toString());
    if (params.parentId != null) __params = __params.set('parentId', params.parentId.toString());
    if (params.offset != null) __params = __params.set('offset', params.offset.toString());
    if (params.minimumAge != null) __params = __params.set('minimumAge', params.minimumAge.toString());
    if (params.limit != null) __params = __params.set('limit', params.limit.toString());
    if (params.includeUntracked != null) __params = __params.set('includeUntracked', params.includeUntracked.toString());
    if (params.assetstoreId != null) __params = __params.set('assetstoreId', params.assetstoreId.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/system/uploads`, __body, {
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
   * Must be a system administrator to call this.
   * @param params The `SystemService.SystemGetPartialUploadsParams` containing the following parameters:
   *
   * - `userId`: Restrict listing uploads to those started by a specific user.
   *
   * - `uploadId`: List only a specific upload.
   *
   * - `sortdir`: Sort order: 1 for ascending, -1 for descending.
   *
   * - `sort`: Field to sort the result set by.
   *
   * - `parentId`: Restrict listing uploads to those within a specific folder or item.
   *
   * - `offset`: Offset into result set.
   *
   * - `minimumAge`: Restrict listing uploads to those that are at least this many days old.
   *
   * - `limit`: Result set size limit.
   *
   * - `includeUntracked`: Some assetstores can have partial uploads that are no longer in the Girder database.  If this is True, include all of them (only filtered by assetstoreId) in the result list.
   *
   * - `assetstoreId`: Restrict listing uploads within a specific assetstore.
   */
  systemGetPartialUploads(params: SystemService.SystemGetPartialUploadsParams): __Observable<null> {
    return this.systemGetPartialUploadsResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param fromGit If true, use git to get the version of the server and any plugins that are git repositories.  This supplements the usual version information.
   */
  systemGetVersionResponse(fromGit?: boolean): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (fromGit != null) __params = __params.set('fromGit', fromGit.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/system/version`, __body, {
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
   * @param fromGit If true, use git to get the version of the server and any plugins that are git repositories.  This supplements the usual version information.
   */
  systemGetVersion(fromGit?: boolean): __Observable<null> {
    return this.systemGetVersionResponse(fromGit).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `SystemService.SystemBuildWebCodeParams` containing the following parameters:
   *
   * - `progress`: Whether to record progress on this task.
   *
   * - `dev`: Whether to build for development mode.
   */
  systemBuildWebCodeResponse(params: SystemService.SystemBuildWebCodeParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.progress != null) __params = __params.set('progress', params.progress.toString());
    if (params.dev != null) __params = __params.set('dev', params.dev.toString());
    let req = new HttpRequest<any>('POST', this.rootUrl + `/system/web_build`, __body, {
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
   * @param params The `SystemService.SystemBuildWebCodeParams` containing the following parameters:
   *
   * - `progress`: Whether to record progress on this task.
   *
   * - `dev`: Whether to build for development mode.
   */
  systemBuildWebCode(params: SystemService.SystemBuildWebCodeParams): __Observable<null> {
    return this.systemBuildWebCodeResponse(params).pipe(__map(_r => _r.body as null));
  }
}

module SystemService {
  /**
   * Parameters for systemGetConfigurationOption
   */
  export interface SystemGetConfigurationOptionParams {
    /**
     * The section identifying the configuration option.
     */
    section: string;

    /**
     * The key identifying the configuration option.
     */
    key: string;
  }

  /**
   * Parameters for systemGetLog
   */
  export interface SystemGetLogParams {
    /**
     * Which log to tail.
     */
    log?: 'error' | 'info';

    /**
     * Controls how many bytes (from the end of the log) to show. Pass 0 to show the whole log.
     */
    bytes?: number;
  }

  /**
   * Parameters for systemGetSetting
   */
  export interface SystemGetSettingParams {
    /**
     * A JSON list of keys representing a set of settings to return.
     */
    list?: string;

    /**
     * The key identifying this setting.
     */
    key?: string;

    /**
     * If "none", return a null value if a setting is currently the default value. If "default", return the default value of the setting(s).
     */
    default?: string;
  }

  /**
   * Parameters for systemSetSetting
   */
  export interface SystemSetSettingParams {
    /**
     * The value for this setting.
     */
    value?: string;

    /**
     * A JSON list of objects with key and value representing a list of settings to set.
     */
    list?: string;

    /**
     * The key identifying this setting.
     */
    key?: string;
  }

  /**
   * Parameters for systemDiscardPartialUploads
   */
  export interface SystemDiscardPartialUploadsParams {
    /**
     * Restrict clearing uploads to those started by a specific user.
     */
    userId?: string;

    /**
     * Clear only a specific upload.
     */
    uploadId?: string;

    /**
     * Restrict clearing uploads to those within a specific folder or item.
     */
    parentId?: string;

    /**
     * Restrict clearing uploads to those that are at least this many days old.
     */
    minimumAge?: number;

    /**
     * Some assetstores can have partial uploads that are no longer in the Girder database.  If this is True, remove all of them (only filtered by assetstoreId).
     */
    includeUntracked?: boolean;

    /**
     * Restrict clearing uploads within a specific assetstore.
     */
    assetstoreId?: string;
  }

  /**
   * Parameters for systemGetPartialUploads
   */
  export interface SystemGetPartialUploadsParams {
    /**
     * Restrict listing uploads to those started by a specific user.
     */
    userId?: string;

    /**
     * List only a specific upload.
     */
    uploadId?: string;

    /**
     * Sort order: 1 for ascending, -1 for descending.
     */
    sortdir?: 1 | -1;

    /**
     * Field to sort the result set by.
     */
    sort?: string;

    /**
     * Restrict listing uploads to those within a specific folder or item.
     */
    parentId?: string;

    /**
     * Offset into result set.
     */
    offset?: number;

    /**
     * Restrict listing uploads to those that are at least this many days old.
     */
    minimumAge?: number;

    /**
     * Result set size limit.
     */
    limit?: number;

    /**
     * Some assetstores can have partial uploads that are no longer in the Girder database.  If this is True, include all of them (only filtered by assetstoreId) in the result list.
     */
    includeUntracked?: boolean;

    /**
     * Restrict listing uploads within a specific assetstore.
     */
    assetstoreId?: string;
  }

  /**
   * Parameters for systemBuildWebCode
   */
  export interface SystemBuildWebCodeParams {
    /**
     * Whether to record progress on this task.
     */
    progress?: boolean;

    /**
     * Whether to build for development mode.
     */
    dev?: boolean;
  }
}

export { SystemService };
