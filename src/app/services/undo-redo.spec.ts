import { TestBed } from '@angular/core/testing';

import { UndoRedo } from './undo-redo';

describe('UndoRedo', () => {
  let service: UndoRedo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UndoRedo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
