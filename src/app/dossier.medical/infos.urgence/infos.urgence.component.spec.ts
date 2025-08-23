import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfosUrgenceComponent } from './infos.urgence.component';

describe('InfosUrgenceComponent', () => {
  let component: InfosUrgenceComponent;
  let fixture: ComponentFixture<InfosUrgenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfosUrgenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfosUrgenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
