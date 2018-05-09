import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectDTO } from '../DTOs/ProjectDTO';
import { ProjectsService } from '../api-handlers/Projects/projects.service';

@Component({
  selector: 'app-project-management',
  templateUrl: './project-management.component.html',
  styleUrls: ['./project-management.component.css']
})
export class ProjectManagementComponent implements OnInit {
  @Input() project: ProjectDTO;

  constructor(private route: ActivatedRoute, private projectsService: ProjectsService) {
  }

  ngOnInit() {
    this.loadProjectDetails();
  }

  loadProjectDetails() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.projectsService.get<ProjectDTO>(id).subscribe(response => this.project = response);
  }

}
