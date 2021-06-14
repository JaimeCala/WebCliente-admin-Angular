import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PedidoRoutingModule } from './pedido-routing.module';
import { PedidoComponent } from './pedido.component';
import { MaterialModule } from '../../../material.module';


@NgModule({
  declarations: [PedidoComponent],
  imports: [
    CommonModule,
    PedidoRoutingModule,
    MaterialModule,

  ]
})
export class PedidoModule { }
