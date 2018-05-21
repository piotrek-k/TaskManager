using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectManagementTool.Models.DbModels
{
    public class LongTermGoal
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public int ProjectId { get; set; }
        public Project Project { get; set; }

        public bool Archived { get; set; }

        public DateTimeOffset? LastModified { get; set; }

        public List<Column> Columns { get; set; }
    }
}
