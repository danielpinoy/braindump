import { TestBed } from '@angular/core/testing';

import { DragDrop } from './drag-drop';

describe('DragDrop', () => {
  let service: DragDrop;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DragDrop);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
