import { TestBed } from '@angular/core/testing';

import { PedidoproductoService } from './pedidoproducto.service';

describe('PedidoproductoService', () => {
  let service: PedidoproductoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PedidoproductoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
