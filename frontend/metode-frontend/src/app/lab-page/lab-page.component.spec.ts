import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabPageComponent } from './lab-page.component';

describe('LabPageComponent', () => {
  let component: LabPageComponent;
  let fixture: ComponentFixture<LabPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
