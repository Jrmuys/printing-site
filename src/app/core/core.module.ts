import { SharedModule } from './../shared/shared.module';
import { AuthHeaderInterceptorService } from './interceptors/auth-header-interceptor.service';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { CoreRoutingModule } from './core-routing.module';
import { throwIfAlreadyLoaded } from './utils/module-import.guard';

@NgModule({
  declarations: [],
  imports: [CommonModule, CoreRoutingModule, SharedModule],
  // providers: [
  //   {
  //     provide: HTTP_INTERCEPTORS,
  //     useClass: AuthHeaderInterceptorService,
  //     multi: true,
  //   },
  // ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
