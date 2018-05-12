using ProjectManagementTool.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectManagementTool.Models.DbModels
{
    public class TodoTask : ILastModificationTracking
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTimeOffset? Date { get; set; }

        public int ColumnId { get; set; }
        public Column Column { get; set; }

        public void KeepParentsLastModificationValueUpdated()
        {
            Column.LongTermGoal.LastModified = DateTimeOffset.Now;
            Column.LongTermGoal.Project.LastModified = DateTimeOffset.Now;
        }
    }
}
