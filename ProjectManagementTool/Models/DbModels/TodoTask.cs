using ProjectManagementTool.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectManagementTool.Models.DbModels
{
    public class TodoTask : _ProtectedTable, ILastModificationTracking
    {
        public int Id { get; set; }
        /// <summary>
        /// The purpose of this variable changed. It's now meant to be "Title".
        /// For additional markdown text check for 'Details'.
        /// </summary>
        public string Content { get; set; }
        /// <summary>
        /// This is where markdown text lands
        /// </summary>
        public string Details { get; set; }
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
