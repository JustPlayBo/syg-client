import { SwellService, SwellConfig, SwellConfigService } from './swell.service';
import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresenceComponent } from './presence/presence.component';

@NgModule({
  declarations: [PresenceComponent],
  imports: [
    CommonModule
  ]
})
export class SwellModule { 
  static forRoot(config: SwellConfig): ModuleWithProviders {
    return {
      ngModule: SwellModule,
      providers: [
        SwellService,
        {
          provide: SwellConfigService,
          useValue: config
        }
      ]
    }
  }
}
