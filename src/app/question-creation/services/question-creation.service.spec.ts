import { TestBed } from '@angular/core/testing';

import { QuestionCreationService } from './question-creation.service';

describe('QuestionCreationService', () => {
  let service: QuestionCreationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionCreationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
