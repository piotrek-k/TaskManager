import { LinksService } from './../api-handlers/Links/links.service';
import { LinkDTO } from './../DTOs/LinkDTO';
import { ProjectDTO } from './../DTOs/ProjectDTO';
import { JsonPipe } from '@angular/common';
import { ProjectsService } from './../api-handlers/Projects/projects.service';
import { Component, OnInit } from '@angular/core';
import { TodoTasksService } from '../api-handlers/TodoTasks/todo-tasks.service';
import { TodoTaskDTO } from '../DTOs/TodoTaskDTO';

@Component({
  selector: 'app-projects-overview',
  templateUrl: './projects-overview.component.html',
  styleUrls: ['./projects-overview.component.css']
})
export class ProjectsOverviewComponent implements OnInit {
  recentProjects: ProjectDTO[];
  linksToRead: LinkDTO[];
  recentTodoTasks: TodoTaskDTO[];

  constructor(private projectsService: ProjectsService, private linksService: LinksService, private todotasksService: TodoTasksService) { }

  ngOnInit() {
    this.getSomeData();
  }

  getSomeData() {
    this.projectsService.getAll<ProjectDTO>().subscribe(response => this.recentProjects = response);
    this.linksService.getAll<LinkDTO>().subscribe(response => this.linksToRead = response);
    this.todotasksService.getAll<TodoTaskDTO>().subscribe(response => this.recentTodoTasks = response);
  }

}
