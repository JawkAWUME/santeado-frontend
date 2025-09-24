import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DossierHistorique } from './dossier-historique';

describe('DossierHistorique', () => {
  let component: DossierHistorique;
  let fixture: ComponentFixture<DossierHistorique>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DossierHistorique]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DossierHistorique);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
