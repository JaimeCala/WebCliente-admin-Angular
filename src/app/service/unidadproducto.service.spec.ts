import { TestBed } from '@angular/core/testing';

import { UnidadproductoService } from './unidadproducto.service';

describe('UnidadproductoService', () => {
  let service: UnidadproductoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnidadproductoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
