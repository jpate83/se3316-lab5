import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NasaSearchComponent } from './nasa-search.component';

describe('NasaSearchComponent', () => {
  let component: NasaSearchComponent;
  let fixture: ComponentFixture<NasaSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NasaSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NasaSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
