import { LinkDTO } from './../DTOs/LinkDTO';
import { LinksService } from './../api-handlers/Links/links.service';
import { TodoTasksService } from './../api-handlers/TodoTasks/todo-tasks.service';
import { Component, OnInit, Input } from '@angular/core';
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

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private longTermGoalService: LongTermGoalsService,
    private columnsSevice: ColumnsService,
    private todotaskSerice: TodoTasksService,
    private linksService: LinksService) {
  }

  ngOnInit() {
    this.loadProjectDetails();
  }

  loadProjectDetails() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.projectsService.get<ProjectDTO>(id).subscribe(response => {
      this.project = response;
      
      this.longTermGoalService.getManyByProjectId(this.project.id)
        .subscribe(
          response => this.longTermGoals = response
        );
      this.columnsSevice.getMany<ColumnDTO>().subscribe(response => this.columns = response);
      this.todotaskSerice.getMany<TodoTaskDTO>().subscribe(response => this.tasks = response);
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

}
