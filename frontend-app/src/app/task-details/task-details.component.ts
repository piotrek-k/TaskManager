import { TodoTaskDTO } from './../DTOs/TodoTaskDTO';
import { Component, OnInit, ViewChildren, ViewChild, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TodoTasksService } from '../api-handlers/TodoTasks/todo-tasks.service';
import { EventEmitter } from '@angular/core';
import { modalConfigDefaults } from 'ngx-bootstrap/modal/modal-options.class';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit {

  //data got from modal caller. it's needed because modal displays faster than data come from server
  taskId: number;
  taskName: string;

  taskObject: TodoTaskDTO; //task loaded from server

  enableAutosave: boolean = true; //user can choose if content should be autosaved
  taskContentSaved: boolean = true; //prompt whether task is saved to database
  lastSave: Date = new Date(); //datetime of last save to database

  @ViewChild('taskEditTextarea') taskEditTextarea;
  @Output() taskChangedAction : EventEmitter<any> = new EventEmitter(); //event called after task modification and save

  constructor(
    public bsModalRef: BsModalRef,
    private todotaskService: TodoTasksService) { }

  ngOnInit() {
    this.todotaskService.getWithId<TodoTaskDTO>(this.taskId).subscribe(response => {
      this.taskObject = response;
    });

    setInterval(() => this.autoSaveChanges(), 3000);
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

  autoSaveChanges(){
    let currentTime = new Date();
    if(this.lastSave.getTime() + 1000*3 < currentTime.getTime() && !this.taskContentSaved && this.enableAutosave){
      console.log("Saving content...");
      //do not autoupdate faster than once per 3 seconds
      this.todotaskService.putWithId<TodoTaskDTO>(this.taskId, this.taskObject).subscribe();
      this.taskContentSaved = true;
      this.lastSave = new Date();
      this.taskChangedAction.emit({modifiedTaskObject: this.taskObject}); //inform parent about changes
    }
  }

  saveChanges() {
    this.todotaskService.putWithId<TodoTaskDTO>(this.taskId, this.taskObject).subscribe();
    this.bsModalRef.hide();
  }

}
