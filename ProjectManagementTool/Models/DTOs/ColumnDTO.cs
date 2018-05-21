using Microsoft.EntityFrameworkCore;
using ProjectManagementTool.Models.DbModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectManagementTool.Models.DTOs
{
    public class ColumnDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int OrderIndex { get; set; }
        public int LongTermGoalId { get; set; }

        public static List<ColumnDTO> DbSetToDtoList(IEnumerable<Column> columns)
        {
            var dtosToReturn = new List<ColumnDTO>();
            foreach (var c in columns)
            {
                dtosToReturn.Add(DbObjectToDto(c));
            }
            return dtosToReturn;
        }

        public static ColumnDTO DbObjectToDto(Column column)
        {
            return new ColumnDTO()
            {
                Id = column.Id,
                Name = column.Name,
                OrderIndex = column.OrderIndex,
                LongTermGoalId = column.LongTermGoalId
            };
        }

        public static Column UpdateDbObjectWithDTO(Column column, ColumnDTO dto)
        {
            column.Name = dto.Name;
            column.OrderIndex = dto.OrderIndex;
            column.LongTermGoalId = dto.LongTermGoalId;

            return column;
        }
    }
}
