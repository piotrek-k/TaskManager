using Microsoft.EntityFrameworkCore;
using ProjectManagementTool.Models.DbModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectManagementTool.Models.DTOs
{
    public class LongTermGoalDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int ProjectId { get; set; }
        public bool Archived { get; set; }

        public static List<LongTermGoalDTO> DbSetToDtoList(IEnumerable<LongTermGoal> ltgs)
        {
            var dtosToReturn = new List<LongTermGoalDTO>();
            foreach (var l in ltgs)
            {
                dtosToReturn.Add(DbObjectToDto(l));
            }
            return dtosToReturn;
        }

        public static LongTermGoalDTO DbObjectToDto(LongTermGoal ltg)
        {
            return new LongTermGoalDTO()
            {
                Id = ltg.Id,
                Name = ltg.Name,
                ProjectId = ltg.ProjectId,
                Archived = ltg.Archived
            };
        }

        public static LongTermGoal UpdateDbObjectWithDTO(LongTermGoal ltg, LongTermGoalDTO dto)
        {
            ltg.Name = dto.Name;
            ltg.ProjectId = dto.ProjectId;
            ltg.Archived = dto.Archived;

            return ltg;
        }
    }
}
