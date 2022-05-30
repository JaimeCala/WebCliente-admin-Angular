import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalbannerComponent } from './modalbanner.component';

describe('ModalbannerComponent', () => {
  let component: ModalbannerComponent;
  let fixture: ComponentFixture<ModalbannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalbannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalbannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
