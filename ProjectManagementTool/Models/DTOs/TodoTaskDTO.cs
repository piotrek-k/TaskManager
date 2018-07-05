using Microsoft.EntityFrameworkCore;
using ProjectManagementTool.Models.DbModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectManagementTool.Models.DTOs
{
    public class TodoTaskDTO
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public string Details { get; set; }
        public DateTimeOffset? Date { get; set; }
        public int ColumnId { get; set; }

        public static List<TodoTaskDTO> DbSetToDtoList(IEnumerable<TodoTask> tasks)
        {
            var dtosToReturn = new List<TodoTaskDTO>();
            foreach (var t in tasks)
            {
                dtosToReturn.Add(DbObjectToDto(t));
            }
            return dtosToReturn;
        }

        public static TodoTaskDTO DbObjectToDto(TodoTask task)
        {
            return new TodoTaskDTO()
            {
                Id = task.Id,
                Content = task.Content,
                Details = task.Details,
                Date = task.Date,
                ColumnId = task.ColumnId
            };
        }

        public static TodoTask UpdateDbObjectWithDTO(TodoTask task, TodoTaskDTO dto)
        {
            task.Content = dto.Content;
            task.Details = dto.Details;
            //task.Date = task.Date; //chyba nie ma potrzeby zmieniać
            task.ColumnId = dto.ColumnId;

            return task;
        }
    }
}
