import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddPredataDialogComponent } from './add-predata-dialog.component';

describe('AddPredataDialogComponent', () => {
  let component: AddPredataDialogComponent;
  let fixture: ComponentFixture<AddPredataDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPredataDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPredataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
