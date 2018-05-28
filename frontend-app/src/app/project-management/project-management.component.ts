import { LtgDetailsComponent } from './../ltg-details/ltg-details.component';
import { TaskDetailsComponent } from './../task-details/task-details.component';
import { LinkDTO } from './../DTOs/LinkDTO';
import { LinksService } from './../api-handlers/Links/links.service';
import { TodoTasksService } from './../api-handlers/TodoTasks/todo-tasks.service';
import { Component, OnInit, Input, ElementRef, ViewChild, ChangeDetectorRef, ViewChildren, QueryList, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectDTO } from '../DTOs/ProjectDTO';
import { ProjectsService } from '../api-handlers/Projects/projects.service';
import { LongTermGoalsService } from '../api-handlers/LongTermGoals/long-term-goals.service';
import { LongTermGoalDTO } from '../DTOs/LongTermGoalDTO';
import { ColumnDTO } from '../DTOs/ColumnDTO';
import { ColumnsService } from '../api-handlers/Columns/columns.service';
import { TodoTaskDTO } from '../DTOs/TodoTaskDTO';
import { DragulaService } from 'ng2-dragula';

import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-project-management',
  templateUrl: './project-management.component.html',
  styleUrls: [
    './project-management.component.css',
    '../../../node_modules/dragula/dist/dragula.css']
})
export class ProjectManagementComponent implements OnInit {
  @Input() project: ProjectDTO;
  longTermGoals: LongTermGoalDTO[];
  columns: ColumnDTO[];
  tasks: TodoTaskDTO[];
  links: LinkDTO[];

  temporaryTask: TodoTaskDTO = new TodoTaskDTO(); //for creating new task
  columnWhereNewTaskIdIsBeingCreated = -1;

  newLongTermGoal: LongTermGoalDTO = new LongTermGoalDTO();

  @ViewChildren('tempTaskInput') temporaryTaskInputs;

  bsModalRef: BsModalRef;
  modalSubscriptions: Subscription[] = [];

  projectMovedToArchive: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private longTermGoalService: LongTermGoalsService,
    private columnsService: ColumnsService,
    private todotaskService: TodoTasksService,
    private linksService: LinksService,
    private dragulaService: DragulaService,
    private modalService: BsModalService,
    private changeDetection: ChangeDetectorRef) {
    dragulaService.drop.subscribe((value) => {
      console.log(`drop: ${value[0]}`);
      this.onDrop(value);
    });
  }

  /**
   * Called when task is being moved from one column to another
   * 
   * @private
   * @param {any} args 
   * @memberof ProjectManagementComponent
   */
  private onDrop(args) {
    let [el, target, source, sibling] = args;
    let modifiedTaskId: number = target.getAttribute("taskid");
    let targetColumnId: number = source.getAttribute("columnid");
    for (let t in this.tasks) {
      if (this.tasks[t].id == modifiedTaskId) {
        this.tasks[t].columnId = targetColumnId;
        this.todotaskService.putWithId(modifiedTaskId, this.tasks[t]).subscribe();
        break;
      }
    }
  }

  ngOnInit() {
    this.loadProjectDetails();
  }

  createNewLTG() {
    console.log(this.newLongTermGoal);
    this.newLongTermGoal.projectId = this.project.id;
    this.longTermGoalService.post<LongTermGoalDTO>(this.newLongTermGoal).subscribe(response => {
      this.downloadColumnsForLTG(response.id);
      this.longTermGoals.push(response);
    });
    this.newLongTermGoal = new LongTermGoalDTO();
  }

  loadProjectDetails() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.projectsService.getWithId<ProjectDTO>(id).subscribe(response => {
      this.project = response;

      this.longTermGoalService.getManyByProjectId(this.project.id)
        .subscribe(
          response => this.longTermGoals = response
        );
      this.columnsService.getMany<ColumnDTO>().subscribe(response => this.columns = response);
      this.todotaskService.getMany<TodoTaskDTO>().subscribe(response => this.tasks = response);
      this.linksService.getMany<LinkDTO>().subscribe(response => this.links = response);
    });

  }

  getLocallyStoredColumnsForLTG(ltgId: number): ColumnDTO[] {
    if (this.columns) {
      return this.columns.filter((x) => { return x.longTermGoalId == ltgId });
    }
    return [];
  }

  reloadLTG(ltgId: number) {
    this.longTermGoalService.getWithId<LongTermGoalDTO>(ltgId).subscribe(response => {
      for (let l in this.longTermGoals) {
        if (this.longTermGoals[l].id == ltgId) {
          this.longTermGoals[l] = response;
          this.downloadColumnsForLTG(ltgId);
          break;
        }
      }
    });
  }

  downloadColumnsForLTG(ltgId: number) {
    this.columnsService.getManyByLongTermGoalId(ltgId).subscribe((response) => {
      for (let r in response) {
        let foundExisting = false;
        for (let c in this.columns) {
          if (response[r].id == this.columns[c].id) {
            foundExisting = true;
            this.columns[c] = response[r];
            break;
          }
        }
        if (!foundExisting) {
          this.columns.push(response[r]);
        }
      }
    });
  }

  getTasksForColumn(taskId: number): TodoTaskDTO[] {
    if (this.tasks) {
      return this.tasks.filter((x) => { return x.columnId == taskId });
    }
    return [];
  }

  newTemporaryTask(event: any, columnId) {
    this.columnWhereNewTaskIdIsBeingCreated = columnId;
    //this.temporaryTask = new TodoTaskDTO();
    console.log(this.temporaryTaskInputs);
    setTimeout(() => this.temporaryTaskInputs
      .find(x => x.nativeElement.getAttribute("columnid") == this.columnWhereNewTaskIdIsBeingCreated)
      .nativeElement.focus()
    );
  }

  abandonTempTask() {
    this.temporaryTask.content = "";
    this.columnWhereNewTaskIdIsBeingCreated = -1;
  }

  saveTempTask(columnId) {
    console.log("Posting tag")
    this.temporaryTask.columnId = columnId;
    this.todotaskService.post<TodoTaskDTO>(this.temporaryTask).subscribe(response => {
      this.tasks.push(response);
    });
    this.abandonTempTask();
  }

  addToArchive(ltgId) {
    for (let l in this.longTermGoals) {
      if (this.longTermGoals[l].id == ltgId) {
        this.longTermGoals[l].archived = true;
        this.longTermGoalService.putWithId(ltgId, this.longTermGoals[l]).subscribe();
        break;
      }
    }
  }

  openTaskDetails(taskId: number, taskName: string) {
    //open task-details modal
    const initialState = {
      taskId: taskId,
      taskName: taskName
    };
    this.bsModalRef = this.modalService.show(TaskDetailsComponent, { initialState, class: 'modal-lg' });
    this.bsModalRef.content.taskChangedAction.subscribe((value) => {
      // updating task with modified version (from modal)
      for (let t in this.tasks) {
        if (this.tasks[t].id == value.modifiedTaskObject.id) {
          this.tasks[t] = value.modifiedTaskObject;
          break;
        }
      }
    });
  }

  openLtgDetails(ltgId: number, ltgName: string) {
    const initialState = {
      ltgId: ltgId,
      ltgName: ltgName
    };
    this.bsModalRef = this.modalService.show(LtgDetailsComponent, { initialState, class: 'modal-lg' });
    this.modalSubscriptions.push(
      this.modalService.onHide.subscribe((value) => {
        // updating task with modified version (from modal)
        this.reloadLTG(ltgId);
        this.unsubscribeAllModals();
      })
    );
  }

  addProjectToArchive() {
    this.project.archived = true;
    this.projectsService.putWithId(this.project.id, this.project).subscribe(result => {
      this.project = null;
      this.projectMovedToArchive = true;
    });
  }

  //usunięcie śledzenia eventów związanych z modalami
  unsubscribeAllModals() {
    this.modalSubscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.modalSubscriptions = [];
  }
}
