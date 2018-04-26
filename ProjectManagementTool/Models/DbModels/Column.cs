using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectManagementTool.Models.DbModels
{
    public class Column
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int OrderIndex { get; set; }

        public List<TodoTask> TodoTasks { get; set; }
    }
}
