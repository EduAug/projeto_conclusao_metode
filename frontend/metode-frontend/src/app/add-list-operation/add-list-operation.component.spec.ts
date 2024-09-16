import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddListOperationComponent } from './add-list-operation.component';

describe('AddListOperationComponent', () => {
  let component: AddListOperationComponent;
  let fixture: ComponentFixture<AddListOperationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddListOperationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddListOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
