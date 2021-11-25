import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentasRoutingModule } from './ventas-routing.module';
import { VentasComponent } from './ventas.component';
import { MaterialModule } from '../../../material.module';


@NgModule({
  declarations: [
    VentasComponent
  ],
  imports: [
    CommonModule,
    VentasRoutingModule,
    MaterialModule,
  ]
})
export class VentasModule { }
