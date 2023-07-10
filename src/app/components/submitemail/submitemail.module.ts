import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubmitemailRoutingModule } from './submitemail-routing.module';
import { SubmitemailComponent } from './submitemail.component';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SubmitemailComponent],
  imports: [
    CommonModule,
    SubmitemailRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
})
export class SubmitemailModule {}
