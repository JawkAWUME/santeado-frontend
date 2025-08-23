import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosticMedicalComponent } from './diagnostic-medical.component';

describe('DiagnosticMedicalComponent', () => {
  let component: DiagnosticMedicalComponent;
  let fixture: ComponentFixture<DiagnosticMedicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagnosticMedicalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiagnosticMedicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
