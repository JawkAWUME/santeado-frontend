import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarRendezvousComponent } from './calendar-rendezvous.component';

describe('CalendarRendezvousComponent', () => {
  let component: CalendarRendezvousComponent;
  let fixture: ComponentFixture<CalendarRendezvousComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarRendezvousComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarRendezvousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
