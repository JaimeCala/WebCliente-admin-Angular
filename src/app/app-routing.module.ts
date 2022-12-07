import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CheckLoginGuard } from './components/guards/check-login.guard';
//import { LoginComponent } from './components/login/login.component';

const routes: Routes = [

  { path: '', loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule) },
  { path: 'notFound', loadChildren: () => import('./components/not-found/not-found.module').then(m => m.NotFoundModule) },

  { path: 'admin', loadChildren: () => import('./components/admin/admin.module').then(m => m.AdminModule) },

  { path: 'login', loadChildren: () => import('./components/login/login.module').then(m => m.LoginModule),
    canActivate: [CheckLoginGuard],
  },

  //{ path: 'reclamo', loadChildren: () => import('./components/admin/reclamo/reclamo.module').then(m => m.ReclamoModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
