import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalpdfComponent } from './modalpdf.component';

describe('ModalpdfComponent', () => {
  let component: ModalpdfComponent;
  let fixture: ComponentFixture<ModalpdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalpdfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalpdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
