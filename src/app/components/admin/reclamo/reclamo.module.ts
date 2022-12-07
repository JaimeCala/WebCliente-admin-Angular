import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReclamoRoutingModule } from './reclamo-routing.module';
import { ReclamoComponent } from './reclamo.component';
import { MaterialModule } from '../../../material.module';


@NgModule({
  declarations: [
    ReclamoComponent
  ],
  imports: [
    CommonModule,
    ReclamoRoutingModule,
    MaterialModule,
  ]
})
export class ReclamoModule { }
