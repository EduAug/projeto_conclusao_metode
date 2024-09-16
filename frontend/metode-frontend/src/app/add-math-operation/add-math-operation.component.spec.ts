import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMathOperationComponent } from './add-math-operation.component';

describe('AddMathOperationComponent', () => {
  let component: AddMathOperationComponent;
  let fixture: ComponentFixture<AddMathOperationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddMathOperationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMathOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
