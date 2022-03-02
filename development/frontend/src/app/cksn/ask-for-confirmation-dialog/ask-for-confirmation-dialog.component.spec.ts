import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AskForConfirmationDialogComponent } from './ask-for-confirmation-dialog.component';

describe('AskForConfirmationDialogComponent', () => {
  let component: AskForConfirmationDialogComponent;
  let fixture: ComponentFixture<AskForConfirmationDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AskForConfirmationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AskForConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
