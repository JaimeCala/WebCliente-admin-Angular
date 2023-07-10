import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalcomprasComponent } from './modalcompras.component';

describe('ModalcomprasComponent', () => {
  let component: ModalcomprasComponent;
  let fixture: ComponentFixture<ModalcomprasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalcomprasComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalcomprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
