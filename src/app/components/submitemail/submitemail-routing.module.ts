import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubmitemailComponent } from './submitemail.component';

const routes: Routes = [{ path: '', component: SubmitemailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubmitemailRoutingModule { }
