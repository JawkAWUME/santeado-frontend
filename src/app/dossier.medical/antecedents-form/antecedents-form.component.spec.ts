import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntecedentsFormComponent } from './antecedents-form.component';

describe('AntecedentsFormComponent', () => {
  let component: AntecedentsFormComponent;
  let fixture: ComponentFixture<AntecedentsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AntecedentsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AntecedentsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
