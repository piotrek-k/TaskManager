import { JsonPipe } from '@angular/common';
import { ProjectsService } from './../api-handlers/Projects/projects.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-projects-overview',
  templateUrl: './projects-overview.component.html',
  styleUrls: ['./projects-overview.component.css']
})
export class ProjectsOverviewComponent implements OnInit {
  response: object;

  constructor(private projectsService: ProjectsService) { }

  ngOnInit() {
  }

  getSomeData() {
    console.log("I've tried :)");
    this.projectsService.getAll().subscribe(response => this.response = response);
  }

}
