import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConsultationDialogComponent } from './add-consultation-dialog.component';

describe('AddConsultationDialogComponent', () => {
  let component: AddConsultationDialogComponent;
  let fixture: ComponentFixture<AddConsultationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddConsultationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddConsultationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
