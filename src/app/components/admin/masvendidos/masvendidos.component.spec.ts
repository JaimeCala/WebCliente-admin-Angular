import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasvendidosComponent } from './masvendidos.component';

describe('MasvendidosComponent', () => {
  let component: MasvendidosComponent;
  let fixture: ComponentFixture<MasvendidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MasvendidosComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasvendidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
