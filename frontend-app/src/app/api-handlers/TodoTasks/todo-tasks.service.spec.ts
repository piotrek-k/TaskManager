import { TestBed, inject } from '@angular/core/testing';

import { TodoTasksService } from './todo-tasks.service';

describe('TodoTasksService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TodoTasksService]
    });
  });

  it('should be created', inject([TodoTasksService], (service: TodoTasksService) => {
    expect(service).toBeTruthy();
  }));
});
