import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasvendidosComponent } from './masvendidos.component';

const routes: Routes = [{ path: '', component: MasvendidosComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasvendidosRoutingModule {}
