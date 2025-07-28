import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UndoRedoControls } from './undo-redo-controls';

describe('UndoRedoControls', () => {
  let component: UndoRedoControls;
  let fixture: ComponentFixture<UndoRedoControls>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UndoRedoControls]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UndoRedoControls);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
