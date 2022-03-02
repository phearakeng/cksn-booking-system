import { TestBed } from '@angular/core/testing';

import { MessageBusService } from './notification.service';

describe('NotificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MessageBusService = TestBed.get(MessageBusService);
    expect(service).toBeTruthy();
  });
});
