import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrespondancesComponent } from './correspondances.component';

describe('CorrespondancesComponent', () => {
  let component: CorrespondancesComponent;
  let fixture: ComponentFixture<CorrespondancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorrespondancesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorrespondancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
