import { TestBed } from '@angular/core/testing';

import { ImgcategoriaService } from './imgcategoria.service';

describe('ImgcategoriaService', () => {
  let service: ImgcategoriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImgcategoriaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
