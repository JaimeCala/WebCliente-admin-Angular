import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';
import { UtilsService } from 'src/app/service/utils.service';



@NgModule({
  declarations: [SidebarComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
  ],
  exports: [SidebarComponent],
  providers: [UtilsService]
})
export class SidebarModule { }
