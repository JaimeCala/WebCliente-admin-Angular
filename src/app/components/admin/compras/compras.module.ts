import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComprasRoutingModule } from './compras-routing.module';
import { ComprasComponent } from './compras.component';
import { MaterialModule } from '../../../material.module';


@NgModule({
  declarations: [
    ComprasComponent
  ],
  imports: [
    CommonModule,
    ComprasRoutingModule,
    MaterialModule,
  ]
})
export class ComprasModule { }
