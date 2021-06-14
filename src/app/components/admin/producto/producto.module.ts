import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductoRoutingModule } from './producto-routing.module';
import { ProductoComponent } from './producto.component';
import { MaterialModule } from '../../../material.module';


@NgModule({
  declarations: [ProductoComponent],
  imports: [
    CommonModule,
    ProductoRoutingModule,
    MaterialModule,
  ]
})
export class ProductoModule { }
