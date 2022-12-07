import { TestBed } from '@angular/core/testing';

import { NotifsocketService } from './notifsocket.service';

describe('NotifsocketService', () => {
  let service: NotifsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotifsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
