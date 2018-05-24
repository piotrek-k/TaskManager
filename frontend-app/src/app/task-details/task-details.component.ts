import { TodoTaskDTO } from './../DTOs/TodoTaskDTO';
import { Component, OnInit, ViewChildren, ViewChild } from '@angular/core';
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

  @ViewChild('taskEditTextarea') taskEditTextarea;

  constructor(
    public bsModalRef: BsModalRef,
    private todotaskService: TodoTasksService) { }

  ngOnInit() {
    this.todotaskService.getWithId<TodoTaskDTO>(this.taskId).subscribe(response => {
      this.taskObject = response;
    });
  }

  ngAfterViewInit(){
    this.textareaAdjust();
  }

  textareaAdjust() {
    if (this.taskEditTextarea) {
      let o = this.taskEditTextarea.nativeElement;
      o.style.height = "1px";
      o.style.height = (25 + o.scrollHeight) + "px";
    }
  }

  saveChanges() {
    this.todotaskService.putWithId<TodoTaskDTO>(this.taskId, this.taskObject).subscribe();
    this.bsModalRef.hide();
  }

}
