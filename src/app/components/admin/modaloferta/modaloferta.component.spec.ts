import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalofertaComponent } from './modaloferta.component';

describe('ModalofertaComponent', () => {
  let component: ModalofertaComponent;
  let fixture: ComponentFixture<ModalofertaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalofertaComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalofertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
