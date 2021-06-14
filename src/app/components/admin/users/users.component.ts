import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { UsersService } from 'src/app/service/users.service';
import { MatDialog } from '@angular/material/dialog'
import { ModalComponent } from '../modal/modal.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements AfterViewInit, OnInit, OnDestroy {

  listaUsuarios: any=[];
  
  displayedColumns: string[] = ['idusuario', 'ci', 'expedido', 'nombre','paterno', 'materno', 'email', 'celular','direccion', 'sexo', 'ciudad', 'estado' ,'username','fecha','hora','nombrerol','actions'];
 
  dataSource = new MatTableDataSource();

  private destroy$ = new Subject<any>();
 

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  constructor(private userService: UsersService,private dialogUser: MatDialog) {}
  ngOnInit(): void {
     this.userService.getTodosUser().subscribe((users)=> {
       this.dataSource.data = users 
       //this.listaUsuarios=users[0].logins,
       //this.listaUsuarios=users[0].rol,
       //console.log("lista logins", this.listaUsuarios ), 
       //console.log(this.dataSource.data);
       this.dataSource.paginator = this.paginator;
      });
     
  }


  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  onOpenModal(users={}): void{
    //console.log('user-->', users);
    this.dialogUser.open(ModalComponent,{
      height:'400px',
      width: '600px',
      hasBackdrop: false,
      data: {title: 'Nuevo usuario',users},
    });
  }

  onDelete(userId: number):void{
    if(window.confirm("Esta seguro de eliminar")){
      this.userService
        .deleteUser(userId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res=>{
          window.alert(res);
        });
    }
  }

  ngOnDestroy(){
    this.destroy$.next({});
    this.destroy$.complete();
  }
  
  /*onSearchClear(){
    this.searchKey="";
    this.applyFilter(this.searchKey);
  }*/

   public applyFilter=(value: string)=>{
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
  

}
