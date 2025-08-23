import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvolutionSuiviComponent } from './evolution-suivi.component';

describe('EvolutionSuiviComponent', () => {
  let component: EvolutionSuiviComponent;
  let fixture: ComponentFixture<EvolutionSuiviComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvolutionSuiviComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvolutionSuiviComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
