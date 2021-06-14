import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';

const routes: Routes = [
 { path: '', component: AdminComponent },
 { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
 { path: 'categoria', loadChildren: () => import('./categoria/categoria.module').then(m => m.CategoriaModule) },
 { path: 'producto', loadChildren: () => import('./producto/producto.module').then(m => m.ProductoModule) },
 { path: 'proveedor', loadChildren: () => import('./proveedor/proveedor.module').then(m => m.ProveedorModule) },
 { path: 'pedido', loadChildren: () => import('./pedido/pedido.module').then(m => m.PedidoModule) }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
