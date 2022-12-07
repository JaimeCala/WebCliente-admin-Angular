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
import { ModalventaComponent } from './modalventa/modalventa/modalventa.component';
import { ModalcomprasComponent } from './modalcompras/modalcompras.component';
import { ModalofertaComponent } from './modaloferta/modaloferta.component';
import { ModalbannerComponent } from './modalbanner/modalbanner.component';
import { ModalpdfComponent } from './modalpdf/modalpdf.component';



@NgModule({
  declarations: [AdminComponent, ModalComponent, ModalcategoriaComponent, ModalproductoComponent, ModalproveedorComponent, ModalpedidoComponent, ModalventaComponent, ModalcomprasComponent, ModalofertaComponent, ModalbannerComponent, ModalpdfComponent, ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    
  ]
})
export class AdminModule { }
