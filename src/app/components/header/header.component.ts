import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';
import { UtilsService } from 'src/app/service/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAdmin = null;
  isLogged = false;

  //private subscription: Subscription = new Subscription();
  private destroy = new Subject<any>();

  @Output() toggleSidenav = new EventEmitter<void>();

  constructor(private authService: AuthService, private utilsService: UtilsService) { }

  

  ngOnInit(): void {
    //this.subscription.add(this.authService.isLogged.subscribe((res)=>(this.isLogged = res)));

    this.authService.isLogged
              .pipe(takeUntil(this.destroy))        
              .subscribe((res)=>(this.isLogged = res))
    
    this.authService.isAdmin
            .pipe(takeUntil(this.destroy))        
            .subscribe((res)=> (this.isAdmin = res));
     
  }

  ngOnDestroy(): void {
      //this.subscription.unsubscribe();
      
      this.destroy.next({});
      this.destroy.complete();
    }
  onToggleSidenav(): void{
    this.toggleSidenav.emit();
  }

  onLogout(): void{
    this.authService.logout();
    this.utilsService.openSidebar(false);
    
  }

}
