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
class UserService extends __BaseService {
  static readonly userFindPath = '/user';
  static readonly userCreateUserPath = '/user';
  static readonly userLogoutPath = '/user/authentication';
  static readonly userLoginPath = '/user/authentication';
  static readonly userGetUsersDetailsPath = '/user/details';
  static readonly userGetMePath = '/user/me';
  static readonly userChangePasswordPath = '/user/password';
  static readonly userGenerateTemporaryPasswordPath = '/user/password/temporary';
  static readonly userCheckTemporaryPasswordPath = '/user/password/temporary/{id}';
  static readonly userGetUserMetadataPath = '/user/settings';
  static readonly userSetUserMetadataPath = '/user/settings';
  static readonly userSendVerificationEmailPath = '/user/verification';
  static readonly userDeleteUserPath = '/user/{id}';
  static readonly userGetUserPath = '/user/{id}';
  static readonly userUpdateUserPath = '/user/{id}';
  static readonly userGetUserDetailsPath = '/user/{id}/details';
  static readonly userGetGravatarPath = '/user/{id}/gravatar';
  static readonly userRemoveOtpPath = '/user/{id}/otp';
  static readonly userInitializeOtpPath = '/user/{id}/otp';
  static readonly userFinalizeOtpPath = '/user/{id}/otp';
  static readonly userChangeUserPasswordPath = '/user/{id}/password';
  static readonly userVerifyEmailPath = '/user/{id}/verification';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }

  /**
   * @param params The `UserService.UserFindParams` containing the following parameters:
   *
   * - `text`: Pass this to perform a full text search for items.
   *
   * - `sortdir`: Sort order: 1 for ascending, -1 for descending.
   *
   * - `sort`: Field to sort the result set by.
   *
   * - `offset`: Offset into result set.
   *
   * - `limit`: Result set size limit.
   */
  userFindResponse(params: UserService.UserFindParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.text != null) __params = __params.set('text', params.text.toString());
    if (params.sortdir != null) __params = __params.set('sortdir', params.sortdir.toString());
    if (params.sort != null) __params = __params.set('sort', params.sort.toString());
    if (params.offset != null) __params = __params.set('offset', params.offset.toString());
    if (params.limit != null) __params = __params.set('limit', params.limit.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/user`, __body, {
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
   * @param params The `UserService.UserFindParams` containing the following parameters:
   *
   * - `text`: Pass this to perform a full text search for items.
   *
   * - `sortdir`: Sort order: 1 for ascending, -1 for descending.
   *
   * - `sort`: Field to sort the result set by.
   *
   * - `offset`: Offset into result set.
   *
   * - `limit`: Result set size limit.
   */
  userFind(params: UserService.UserFindParams): __Observable<null> {
    return this.userFindResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `UserService.UserCreateUserParams` containing the following parameters:
   *
   * - `password`: The user's requested password
   *
   * - `login`: The user's requested login.
   *
   * - `lastName`: The user's last name.
   *
   * - `firstName`: The user's first name.
   *
   * - `email`: The user's email address.
   *
   * - `admin`: Whether this user should be a site administrator.
   */
  userCreateUserResponse(params: UserService.UserCreateUserParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.password != null) __params = __params.set('password', params.password.toString());
    if (params.login != null) __params = __params.set('login', params.login.toString());
    if (params.lastName != null) __params = __params.set('lastName', params.lastName.toString());
    if (params.firstName != null) __params = __params.set('firstName', params.firstName.toString());
    if (params.email != null) __params = __params.set('email', params.email.toString());
    if (params.admin != null) __params = __params.set('admin', params.admin.toString());
    let req = new HttpRequest<any>('POST', this.rootUrl + `/user`, __body, {
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
   * @param params The `UserService.UserCreateUserParams` containing the following parameters:
   *
   * - `password`: The user's requested password
   *
   * - `login`: The user's requested login.
   *
   * - `lastName`: The user's last name.
   *
   * - `firstName`: The user's first name.
   *
   * - `email`: The user's email address.
   *
   * - `admin`: Whether this user should be a site administrator.
   */
  userCreateUser(params: UserService.UserCreateUserParams): __Observable<null> {
    return this.userCreateUserResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * Attempts to delete your authentication cookie.
   */
  userLogoutResponse(): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('DELETE', this.rootUrl + `/user/authentication`, __body, {
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
   * Attempts to delete your authentication cookie.
   */
  userLogout(): __Observable<null> {
    return this.userLogoutResponse().pipe(__map(_r => _r.body as null));
  }

  /**
   * Pass your username and password using HTTP Basic Auth. Sends a cookie that should be passed back in future requests.
   * @param Girder-OTP A one-time password for this user
   */
  userLoginResponse(GirderOTP?: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (GirderOTP != null) __headers = __headers.set('Girder-OTP', GirderOTP.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/user/authentication`, __body, {
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
   * Pass your username and password using HTTP Basic Auth. Sends a cookie that should be passed back in future requests.
   * @param Girder-OTP A one-time password for this user
   */
  userLogin(GirderOTP?: string): __Observable<null> {
    return this.userLoginResponse(GirderOTP).pipe(__map(_r => _r.body as null));
  }
  userGetUsersDetailsResponse(): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + `/user/details`, __body, {
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
  userGetUsersDetails(): __Observable<null> {
    return this.userGetUsersDetailsResponse().pipe(__map(_r => _r.body as null));
  }
  userGetMeResponse(): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + `/user/me`, __body, {
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
  userGetMe(): __Observable<null> {
    return this.userGetMeResponse().pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `UserService.UserChangePasswordParams` containing the following parameters:
   *
   * - `old`: Your current password or a temporary access token.
   *
   * - `new`: Your new password.
   */
  userChangePasswordResponse(params: UserService.UserChangePasswordParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.old != null) __params = __params.set('old', params.old.toString());
    if (params.new != null) __params = __params.set('new', params.new.toString());
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/user/password`, __body, {
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
   * @param params The `UserService.UserChangePasswordParams` containing the following parameters:
   *
   * - `old`: Your current password or a temporary access token.
   *
   * - `new`: Your new password.
   */
  userChangePassword(params: UserService.UserChangePasswordParams): __Observable<null> {
    return this.userChangePasswordResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param email Your email address.
   */
  userGenerateTemporaryPasswordResponse(email: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (email != null) __params = __params.set('email', email.toString());
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/user/password/temporary`, __body, {
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
   * @param email Your email address.
   */
  userGenerateTemporaryPassword(email: string): __Observable<null> {
    return this.userGenerateTemporaryPasswordResponse(email).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `UserService.UserCheckTemporaryPasswordParams` containing the following parameters:
   *
   * - `token`: The token to check.
   *
   * - `id`: The user ID to check.
   */
  userCheckTemporaryPasswordResponse(params: UserService.UserCheckTemporaryPasswordParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.token != null) __params = __params.set('token', params.token.toString());

    let req = new HttpRequest<any>('GET', this.rootUrl + `/user/password/temporary/${params.id}`, __body, {
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
   * @param params The `UserService.UserCheckTemporaryPasswordParams` containing the following parameters:
   *
   * - `token`: The token to check.
   *
   * - `id`: The user ID to check.
   */
  userCheckTemporaryPassword(params: UserService.UserCheckTemporaryPasswordParams): __Observable<null> {
    return this.userCheckTemporaryPasswordResponse(params).pipe(__map(_r => _r.body as null));
  }
  userGetUserMetadataResponse(): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + `/user/settings`, __body, {
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
  userGetUserMetadata(): __Observable<null> {
    return this.userGetUserMetadataResponse().pipe(__map(_r => _r.body as null));
  }

  /**
   * @param body A JSON object containing the metadata keys to add
   */
  userSetUserMetadataResponse(body: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/user/settings`, __body, {
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
   * @param body A JSON object containing the metadata keys to add
   */
  userSetUserMetadata(body: string): __Observable<null> {
    return this.userSetUserMetadataResponse(body).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param login Your login or email address.
   */
  userSendVerificationEmailResponse(login: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (login != null) __params = __params.set('login', login.toString());
    let req = new HttpRequest<any>('POST', this.rootUrl + `/user/verification`, __body, {
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
   * @param login Your login or email address.
   */
  userSendVerificationEmail(login: string): __Observable<null> {
    return this.userSendVerificationEmailResponse(login).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the document.
   */
  userDeleteUserResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('DELETE', this.rootUrl + `/user/${id}`, __body, {
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
  userDeleteUser(id: string): __Observable<null> {
    return this.userDeleteUserResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the document.
   */
  userGetUserResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('GET', this.rootUrl + `/user/${id}`, __body, {
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
  userGetUser(id: string): __Observable<null> {
    return this.userGetUserResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `UserService.UserUpdateUserParams` containing the following parameters:
   *
   * - `lastName`: Last name of the user.
   *
   * - `id`: The ID of the document.
   *
   * - `firstName`: First name of the user.
   *
   * - `email`: The email of the user.
   *
   * - `status`: The account status (admin access required)
   *
   * - `admin`: Is the user a site admin (admin access required)
   */
  userUpdateUserResponse(params: UserService.UserUpdateUserParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.lastName != null) __params = __params.set('lastName', params.lastName.toString());

    if (params.firstName != null) __params = __params.set('firstName', params.firstName.toString());
    if (params.email != null) __params = __params.set('email', params.email.toString());
    if (params.status != null) __params = __params.set('status', params.status.toString());
    if (params.admin != null) __params = __params.set('admin', params.admin.toString());
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/user/${params.id}`, __body, {
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
   * @param params The `UserService.UserUpdateUserParams` containing the following parameters:
   *
   * - `lastName`: Last name of the user.
   *
   * - `id`: The ID of the document.
   *
   * - `firstName`: First name of the user.
   *
   * - `email`: The email of the user.
   *
   * - `status`: The account status (admin access required)
   *
   * - `admin`: Is the user a site admin (admin access required)
   */
  userUpdateUser(params: UserService.UserUpdateUserParams): __Observable<null> {
    return this.userUpdateUserResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the document.
   */
  userGetUserDetailsResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('GET', this.rootUrl + `/user/${id}/details`, __body, {
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
  userGetUserDetails(id: string): __Observable<null> {
    return this.userGetUserDetailsResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `UserService.UserGetGravatarParams` containing the following parameters:
   *
   * - `id`: The ID of the user.
   *
   * - `size`: Size in pixels for the image (default=64).
   */
  userGetGravatarResponse(params: UserService.UserGetGravatarParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.size != null) __params = __params.set('size', params.size.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/user/${params.id}/gravatar`, __body, {
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
   * @param params The `UserService.UserGetGravatarParams` containing the following parameters:
   *
   * - `id`: The ID of the user.
   *
   * - `size`: Size in pixels for the image (default=64).
   */
  userGetGravatar(params: UserService.UserGetGravatarParams): __Observable<null> {
    return this.userGetGravatarResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the document.
   */
  userRemoveOtpResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('DELETE', this.rootUrl + `/user/${id}/otp`, __body, {
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
  userRemoveOtp(id: string): __Observable<null> {
    return this.userRemoveOtpResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the document.
   */
  userInitializeOtpResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('POST', this.rootUrl + `/user/${id}/otp`, __body, {
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
  userInitializeOtp(id: string): __Observable<null> {
    return this.userInitializeOtpResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `UserService.UserFinalizeOtpParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `Girder-OTP`: A one-time password for this user
   */
  userFinalizeOtpResponse(params: UserService.UserFinalizeOtpParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.GirderOTP != null) __headers = __headers.set('Girder-OTP', params.GirderOTP.toString());
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/user/${params.id}/otp`, __body, {
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
   * @param params The `UserService.UserFinalizeOtpParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `Girder-OTP`: A one-time password for this user
   */
  userFinalizeOtp(params: UserService.UserFinalizeOtpParams): __Observable<null> {
    return this.userFinalizeOtpResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * Only administrators may use this endpoint.
   * @param params The `UserService.UserChangeUserPasswordParams` containing the following parameters:
   *
   * - `password`: The user's new password.
   *
   * - `id`: The ID of the document.
   */
  userChangeUserPasswordResponse(params: UserService.UserChangeUserPasswordParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.password != null) __params = __params.set('password', params.password.toString());

    let req = new HttpRequest<any>('PUT', this.rootUrl + `/user/${params.id}/password`, __body, {
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
   * Only administrators may use this endpoint.
   * @param params The `UserService.UserChangeUserPasswordParams` containing the following parameters:
   *
   * - `password`: The user's new password.
   *
   * - `id`: The ID of the document.
   */
  userChangeUserPassword(params: UserService.UserChangeUserPasswordParams): __Observable<null> {
    return this.userChangeUserPasswordResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `UserService.UserVerifyEmailParams` containing the following parameters:
   *
   * - `token`: The token to check.
   *
   * - `id`: The user ID to check.
   */
  userVerifyEmailResponse(params: UserService.UserVerifyEmailParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.token != null) __params = __params.set('token', params.token.toString());

    let req = new HttpRequest<any>('PUT', this.rootUrl + `/user/${params.id}/verification`, __body, {
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
   * @param params The `UserService.UserVerifyEmailParams` containing the following parameters:
   *
   * - `token`: The token to check.
   *
   * - `id`: The user ID to check.
   */
  userVerifyEmail(params: UserService.UserVerifyEmailParams): __Observable<null> {
    return this.userVerifyEmailResponse(params).pipe(__map(_r => _r.body as null));
  }
}

module UserService {
  /**
   * Parameters for userFind
   */
  export interface UserFindParams {
    /**
     * Pass this to perform a full text search for items.
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
  }

  /**
   * Parameters for userCreateUser
   */
  export interface UserCreateUserParams {
    /**
     * The user's requested password
     */
    password: string;

    /**
     * The user's requested login.
     */
    login: string;

    /**
     * The user's last name.
     */
    lastName: string;

    /**
     * The user's first name.
     */
    firstName: string;

    /**
     * The user's email address.
     */
    email: string;

    /**
     * Whether this user should be a site administrator.
     */
    admin?: boolean;
  }

  /**
   * Parameters for userChangePassword
   */
  export interface UserChangePasswordParams {
    /**
     * Your current password or a temporary access token.
     */
    old: string;

    /**
     * Your new password.
     */
    new: string;
  }

  /**
   * Parameters for userCheckTemporaryPassword
   */
  export interface UserCheckTemporaryPasswordParams {
    /**
     * The token to check.
     */
    token: string;

    /**
     * The user ID to check.
     */
    id: string;
  }

  /**
   * Parameters for userUpdateUser
   */
  export interface UserUpdateUserParams {
    /**
     * Last name of the user.
     */
    lastName: string;

    /**
     * The ID of the document.
     */
    id: string;

    /**
     * First name of the user.
     */
    firstName: string;

    /**
     * The email of the user.
     */
    email: string;

    /**
     * The account status (admin access required)
     */
    status?: 'pending' | 'enabled' | 'disabled';

    /**
     * Is the user a site admin (admin access required)
     */
    admin?: boolean;
  }

  /**
   * Parameters for userGetGravatar
   */
  export interface UserGetGravatarParams {
    /**
     * The ID of the user.
     */
    id: string;

    /**
     * Size in pixels for the image (default=64).
     */
    size?: number;
  }

  /**
   * Parameters for userFinalizeOtp
   */
  export interface UserFinalizeOtpParams {
    /**
     * The ID of the document.
     */
    id: string;

    /**
     * A one-time password for this user
     */
    GirderOTP: string;
  }

  /**
   * Parameters for userChangeUserPassword
   */
  export interface UserChangeUserPasswordParams {
    /**
     * The user's new password.
     */
    password: string;

    /**
     * The ID of the document.
     */
    id: string;
  }

  /**
   * Parameters for userVerifyEmail
   */
  export interface UserVerifyEmailParams {
    /**
     * The token to check.
     */
    token: string;

    /**
     * The user ID to check.
     */
    id: string;
  }
}

export { UserService };
