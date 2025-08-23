import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamensComplementairesComponent } from './examens.complementaires.component';

describe('ExamensComplementairesComponent', () => {
  let component: ExamensComplementairesComponent;
  let fixture: ComponentFixture<ExamensComplementairesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamensComplementairesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamensComplementairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
