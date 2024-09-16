import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTextPopupComponent } from './add-text-popup.component';

describe('AddTextPopupComponent', () => {
  let component: AddTextPopupComponent;
  let fixture: ComponentFixture<AddTextPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddTextPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTextPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
