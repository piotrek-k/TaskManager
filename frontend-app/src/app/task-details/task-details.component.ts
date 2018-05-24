import { TodoTaskDTO } from './../DTOs/TodoTaskDTO';
import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TodoTasksService } from '../api-handlers/TodoTasks/todo-tasks.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit {

  taskId: number;
  taskName: string;
  taskObject: TodoTaskDTO;

  constructor(
    public bsModalRef: BsModalRef,
    private todotaskService: TodoTasksService) { }

  ngOnInit() {
    this.todotaskService.getWithId<TodoTaskDTO>(this.taskId).subscribe(response => {
      this.taskObject = response;
    });
  }

}
