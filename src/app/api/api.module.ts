/* tslint:disable */
import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiConfiguration, ApiConfigurationInterface } from './api-configuration';

import { ApiKeyService } from './services/api-key.service';
import { AssetstoreService } from './services/assetstore.service';
import { CollectionService } from './services/collection.service';
import { DatasetService } from './services/dataset.service';
import { DmService } from './services/dm.service';
import { FileService } from './services/file.service';
import { FolderService } from './services/folder.service';
import { GroupService } from './services/group.service';
import { HomedirpassService } from './services/homedirpass.service';
import { ImageService } from './services/image.service';
import { InstanceService } from './services/instance.service';
import { IntegrationService } from './services/integration.service';
import { ItemService } from './services/item.service';
import { JobService } from './services/job.service';
import { LicenseService } from './services/license.service';
import { NotificationService } from './services/notification.service';
import { OauthService } from './services/oauth.service';
import { PublishService } from './services/publish.service';
import { RepositoryService } from './services/repository.service';
import { ResourceService } from './services/resource.service';
import { SystemService } from './services/system.service';
import { TaleService } from './services/tale.service';
import { TokenService } from './services/token.service';
import { UserService } from './services/user.service';
import { VersionService } from './services/version.service';
import { WholetaleService } from './services/wholetale.service';
import { WorkerService } from './services/worker.service';

import { TokenInterceptor } from './token.interceptor';
import { TokenService as JwtTokenService } from './token.service';

import { AuthGuard } from './auth-guard';

/**
 * Provider for all Api services, plus ApiConfiguration
 */
@NgModule({
  imports: [HttpClientModule],
  exports: [HttpClientModule],
  declarations: [],
  providers: [
    ApiConfiguration,
    ApiKeyService,
    AssetstoreService,
    AuthGuard,
    CollectionService,
    DatasetService,
    DmService,
    FileService,
    FolderService,
    GroupService,
    HomedirpassService,
    ImageService,
    InstanceService,
    IntegrationService,
    ItemService,
    JobService,
    LicenseService,
    NotificationService,
    OauthService,
    PublishService,
    RepositoryService,
    ResourceService,
    SystemService,
    TaleService,
    TokenService,
    UserService,
    VersionService,
    WholetaleService,
    WorkerService,
    JwtTokenService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
})
export class ApiModule {
  constructor(@Optional() @SkipSelf() parentModule?: ApiModule) {
    if (parentModule) {
      throw new Error('ApiModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(customParams: ApiConfigurationInterface): ModuleWithProviders<ApiModule> {
    return {
      ngModule: ApiModule,
      providers: [
        {
          provide: ApiConfiguration,
          useValue: { rootUrl: customParams.rootUrl },
        },
      ],
    };
  }
}
