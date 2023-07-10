import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProveedorRoutingModule } from './proveedor-routing.module';
import { ProveedorComponent } from './proveedor.component';
import { MaterialModule } from '../../../material.module';

@NgModule({
  declarations: [ProveedorComponent],
  imports: [CommonModule, ProveedorRoutingModule, MaterialModule],
})
export class ProveedorModule {}
