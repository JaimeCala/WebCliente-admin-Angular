import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { ModalComponent } from './modal/modal.component';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalcategoriaComponent } from './modalcategoria/modalcategoria.component';
import { ModalproductoComponent } from './modalproducto/modalproducto.component';
import { ModalproveedorComponent } from './modalproveedor/modalproveedor.component';
import { ModalpedidoComponent } from './modalpedido/modalpedido.component';


@NgModule({
  declarations: [AdminComponent, ModalComponent, ModalcategoriaComponent, ModalproductoComponent, ModalproveedorComponent, ModalpedidoComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    
  ]
})
export class AdminModule { }
