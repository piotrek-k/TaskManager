using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectManagementTool.Models.DbModels
{
    public class Project
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public bool Archived { get; set; }

        public DateTimeOffset? LastModified { get; set; }

        public List<LongTermGoal> LongTermGoals { get; set; }
        public List<Link> Links { get; set; }
    }
}
