import { LinkDTO } from './../DTOs/LinkDTO';
import { LinksService } from './../api-handlers/Links/links.service';
import { TodoTasksService } from './../api-handlers/TodoTasks/todo-tasks.service';
import { Component, OnInit, Input, ElementRef, ViewChild, ChangeDetectorRef, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectDTO } from '../DTOs/ProjectDTO';
import { ProjectsService } from '../api-handlers/Projects/projects.service';
import { LongTermGoalsService } from '../api-handlers/LongTermGoals/long-term-goals.service';
import { LongTermGoalDTO } from '../DTOs/LongTermGoalDTO';
import { ColumnDTO } from '../DTOs/ColumnDTO';
import { ColumnsService } from '../api-handlers/Columns/columns.service';
import { TodoTaskDTO } from '../DTOs/TodoTaskDTO';

@Component({
  selector: 'app-project-management',
  templateUrl: './project-management.component.html',
  styleUrls: ['./project-management.component.css']
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

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private longTermGoalService: LongTermGoalsService,
    private columnsService: ColumnsService,
    private todotaskService: TodoTasksService,
    private linksService: LinksService) {
  }

  ngOnInit() {
    this.loadProjectDetails();
  }

  createNewLTG() {
    console.log(this.newLongTermGoal);
    this.newLongTermGoal.projectId = this.project.id;
    this.longTermGoalService.post<LongTermGoalDTO>(this.newLongTermGoal).subscribe(response => {
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

  getColumnsForLTG(ltgId: number): ColumnDTO[] {
    if (this.columns) {
      return this.columns.filter((x) => { return x.longTermGoalId == ltgId });
    }
    return [];
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
      .find(x=>x.nativeElement.getAttribute("columnid") == this.columnWhereNewTaskIdIsBeingCreated)
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
}
