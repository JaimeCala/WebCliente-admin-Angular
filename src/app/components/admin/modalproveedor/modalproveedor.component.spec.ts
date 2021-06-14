import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalproveedorComponent } from './modalproveedor.component';

describe('ModalproveedorComponent', () => {
  let component: ModalproveedorComponent;
  let fixture: ComponentFixture<ModalproveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalproveedorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalproveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
