import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitemailComponent } from './submitemail.component';

describe('SubmitemailComponent', () => {
  let component: SubmitemailComponent;
  let fixture: ComponentFixture<SubmitemailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitemailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitemailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
