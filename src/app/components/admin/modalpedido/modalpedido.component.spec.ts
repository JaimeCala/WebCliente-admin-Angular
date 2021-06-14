import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalpedidoComponent } from './modalpedido.component';

describe('ModalpedidoComponent', () => {
  let component: ModalpedidoComponent;
  let fixture: ComponentFixture<ModalpedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalpedidoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalpedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
