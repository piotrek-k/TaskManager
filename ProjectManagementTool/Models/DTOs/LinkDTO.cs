using Microsoft.EntityFrameworkCore;
using ProjectManagementTool.Models.DbModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectManagementTool.Models.DTOs
{
    public class LinkDTO
    {
        public int Id { get; set; }
        public string URL { get; set; }
        public string Description { get; set; }
        public int ProjectId { get; set; }


        public static List<LinkDTO> DbSetToDtoList(DbSet<Link> links)
        {
            var dtosToReturn = new List<LinkDTO>();
            foreach (var l in links)
            {
                dtosToReturn.Add(DbObjectToDto(l));
            }
            return dtosToReturn;
        }

        public static LinkDTO DbObjectToDto(Link link)
        {
            return new LinkDTO()
            {
                Id = link.Id,
                URL = link.URL,
                Description = link.Description,
                ProjectId = link.ProjectId
            };
        }

        public static Link UpdateDbObjectWithDTO(Link link, LinkDTO dto)
        {
            link.URL = dto.URL;
            link.Description = dto.Description;
            link.ProjectId = dto.ProjectId;

            return link;
        }
    }
}
