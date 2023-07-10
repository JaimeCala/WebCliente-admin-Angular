import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from './banner.component';
import { MaterialModule } from '../../../material.module';
import { BannerRoutingModule } from './banner-routing.module';

@NgModule({
  declarations: [BannerComponent],
  imports: [CommonModule, BannerRoutingModule, MaterialModule],
})
export class BannerModule {}
