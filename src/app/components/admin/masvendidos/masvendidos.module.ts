import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasvendidosRoutingModule } from './masvendidos-routing.module';
import { MasvendidosComponent } from './masvendidos.component';
import { MaterialModule } from '../../../material.module';

@NgModule({
  declarations: [MasvendidosComponent],
  imports: [CommonModule, MasvendidosRoutingModule, MaterialModule],
})
export class MasvendidosModule {}
