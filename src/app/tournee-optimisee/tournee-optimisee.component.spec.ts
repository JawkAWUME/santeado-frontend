import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourneeOptimiseeComponent } from './tournee-optimisee.component';

describe('TourneeOptimiseeComponent', () => {
  let component: TourneeOptimiseeComponent;
  let fixture: ComponentFixture<TourneeOptimiseeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TourneeOptimiseeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourneeOptimiseeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
