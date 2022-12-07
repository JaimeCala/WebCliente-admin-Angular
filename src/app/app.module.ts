import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//import { LoginComponent } from './components/login/login.component';
//import { NavbarComponent } from './components/navbar/navbar.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MaterialModule } from './material.module';
import { SidebarModule } from './components/sidebar/sidebar.module';
import { AdminInterceptor } from './interceptors/admin-interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BannerModule } from './components/admin/banner/banner.module';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
//import { PdfComponent } from './components/admin/pdf/pdf.component';

//import { MatDatepickerModule} from '@angular/material/datepicker';
//import { MatNativeDateModule } from '@angular/material/core';

const config: SocketIoConfig = { url: 'http://localhost:8181', options: {} };



@NgModule({
  declarations: [
    AppComponent,
    //LoginComponent,
    //NavbarComponent,
    HeaderComponent,
    FooterComponent,
    //PdfComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    HttpClientModule,

    MaterialModule,

    SidebarModule,
    ReactiveFormsModule,
    FormsModule,
    BannerModule,
    //MatDatepickerModule,
    //MatNativeDateModule,
    SocketIoModule.forRoot(config),




  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AdminInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
