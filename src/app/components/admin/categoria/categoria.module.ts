import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriaRoutingModule } from './categoria-routing.module';
import { CategoriaComponent } from './categoria.component';
import { MaterialModule } from '../../../material.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [CategoriaComponent],
  imports: [
    CommonModule,
    CategoriaRoutingModule,
    MaterialModule,
    FormsModule
  ]
})
export class CategoriaModule { }
