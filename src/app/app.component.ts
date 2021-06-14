import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UtilsService } from './service/utils.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
 
  //title = 'HomeService';
  opened= false;

  private destroy$ = new Subject<any>();

  constructor(private utilsService: UtilsService){}
 
   ngOnInit(): void {
    this.utilsService.sidebarOpened$
    .pipe(takeUntil(this.destroy$))
    .subscribe((res: boolean)=>(this.opened = res));
  }

   ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }
}
