using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectManagementTool.Models.DbModels
{
    public class Column
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int OrderIndex { get; set; }

        public int LongTermGoalId { get; set; }
        [ForeignKey("LongTermGoalId")]
        public LongTermGoal LongTermGoal { get; set; }

        public List<TodoTask> TodoTasks { get; set; }
    }
}
