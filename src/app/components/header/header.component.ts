import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';
import { UtilsService } from 'src/app/service/utils.service';
import { NotifsocketService } from '../../service/notifsocket.service';
import { PedidoService } from '../../service/pedido.service';
import { ReclamoService } from '../../service/reclamo.service';
import { BannerService } from 'src/app/service/banner.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAdmin = null;
  isVendedor = null;
  isLogged = false;

  hiddenNotification = false;
  hiddenMessage = false;

  notification: number;
  notifications = [];

  message: number;
  messages = [];

  newMessage$: Observable<string>;
  newNotification$: Observable<string>;

  //private subscription: Subscription = new Subscription();
  private destroy = new Subject<any>();

  @Output() toggleSidenav = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private utilsService: UtilsService,
    private notificationService: NotifsocketService,
    private reclamoService: ReclamoService,
    private router: Router,
    private pedidoService: PedidoService,
    private bannerService: BannerService
  ) {
    //todo: para actualizar el contador de pedidos.
    this.bannerService.listenBanner().subscribe((m: any) => {
      this.ObtenerPedidoEsperaCount();
    });
  }

  ngOnInit(): void {
    //this.subscription.add(this.authService.isLogged.subscribe((res)=>(this.isLogged = res)));

    this.authService.isLogged
      .pipe(takeUntil(this.destroy))
      .subscribe((res) => (this.isLogged = res));

    this.authService.isAdmin
      .pipe(takeUntil(this.destroy))
      .subscribe((res) => (this.isAdmin = res));

    this.authService.isVendedor
      .pipe(takeUntil(this.destroy))
      .subscribe((res) => (this.isVendedor = res));

    //TODO: socket mensaje reclamo
    this.notificationService.getNewMessage().subscribe((res: string) => {
      this.messages.push(res);

      this.message = this.message + this.messages.length;
      this.messages = [];
    });
    //TODO: carga de mensaje de reclamo
    this.reclamoService
      .getTodosReclamoEstado()
      .pipe(takeUntil(this.destroy))
      .subscribe((estado) => {
        this.message = estado;
      });

    //TODO: socket mensaje notification pedido
    this.notificationService.setNewNotification().subscribe((res: string) => {
      this.notifications.push(res);
      this.notification = this.notification + this.notifications.length;
      this.notifications = [];

      //TODO: se actualiza los pedidos aprovechando el evento contador de notificación de pedido.
      this.pedidoService.filterPedido('desde barra notificacion pedido'); //refresh pedidos
    });

    this.ObtenerPedidoEsperaCount();
  }

  ObtenerPedidoEsperaCount() {
    this.pedidoService
      .getTodosPedidoEsperaCount()
      .pipe(takeUntil(this.destroy))
      .subscribe((estadoespera) => {
        this.notification = estadoespera;
        /*TODO: actualizar el icono de pedidos cuando es enviado.
        this.pedidoService.filterPedido('');*/
      });
  }

  ngOnDestroy(): void {
    //this.subscription.unsubscribe();

    this.destroy.next({});
    this.destroy.complete();
    this.notificationService.disconnectSocket();
  }

  onToggleSidenav(): void {
    this.toggleSidenav.emit();
  }

  onLogout(): void {
    this.authService.logout();
    this.utilsService.openSidebar(false);
  }

  toggleBadgeVisibilityMessage() {
    //this.hiddenMessage = !this.hiddenMessage;
    this.messages = [];
    this.router.navigate(['/admin/reclamo']);
    this.message = 0;
    if (this.message === 0) {
      this.hiddenMessage = true;
    }
  }

  toggleBadgeVisibilityNotification() {
    this.hiddenNotification = !this.hiddenNotification;
    this.notifications = [];
    this.router.navigate(['/admin/pedido']);
    this.notification = 0;
    if (this.notification === 0) {
      this.hiddenNotification = true;
    }
  }
}
