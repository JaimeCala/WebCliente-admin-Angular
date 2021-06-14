import { TestBed } from '@angular/core/testing';

import { ImgproductoService } from './imgproducto.service';

describe('ImgproductoService', () => {
  let service: ImgproductoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImgproductoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
