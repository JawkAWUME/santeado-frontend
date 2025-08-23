import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamenCliniqueFormComponent } from './examen-clinique-form.component';

describe('ExamenCliniqueFormComponent', () => {
  let component: ExamenCliniqueFormComponent;
  let fixture: ComponentFixture<ExamenCliniqueFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamenCliniqueFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamenCliniqueFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
