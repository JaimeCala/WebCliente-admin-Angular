import { NgModule } from "@angular/core";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule} from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule} from '@angular/material/input';
import { ReactiveFormsModule} from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import {  MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule} from '@angular/material/paginator';
//import { FormsModule } from '@angular/forms';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDividerModule } from "@angular/material/divider";
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatBadgeModule} from '@angular/material/badge';

import { PdfViewerModule } from 'ng2-pdf-viewer';




const myModules = [
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatInputModule,
    ReactiveFormsModule,  //fue descomentado para add rangeform
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    MatOptionModule,
    MatSelectModule,
    MatPaginatorModule,
    //FormsModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatDividerModule,
    MatCheckboxModule,
    MatBadgeModule,
    PdfViewerModule,


  ];

@NgModule({
    imports: [ ... myModules],
    exports: [ ... myModules],
    providers: [{provide: MAT_DATE_LOCALE, useValue: 'en-GB'}],
})

export class MaterialModule{}
