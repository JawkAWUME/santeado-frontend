import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCourbeDialogComponent } from './add-courbe-dialog.component';

describe('AddCourbeDialogComponent', () => {
  let component: AddCourbeDialogComponent;
  let fixture: ComponentFixture<AddCourbeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCourbeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCourbeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
