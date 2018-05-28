using Microsoft.EntityFrameworkCore;
using ProjectManagementTool.Models.DbModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectManagementTool.Models.DTOs
{
    public class ProjectDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool Archived { get; set; }

        public static List<ProjectDTO> DbSetToDtoList(IEnumerable<Project> projects)
        {
            var dtosToReturn = new List<ProjectDTO>();
            foreach (var p in projects)
            {
                dtosToReturn.Add(DbObjectToDto(p));
            }
            return dtosToReturn;
        }

        public static ProjectDTO DbObjectToDto(Project project)
        {
            return new ProjectDTO()
            {
                Id = project.Id,
                Name = project.Name,
                Archived = project.Archived
            };
        }

        public static Project UpdateDbObjectWithDTO(Project project, ProjectDTO dto)
        {
            project.Name = dto.Name;
            project.Archived = dto.Archived;

            return project;
        }
    }
}
