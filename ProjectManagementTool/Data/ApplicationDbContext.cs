using Microsoft.EntityFrameworkCore;
using ProjectManagementTool.Models.DbModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectManagementTool.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //    modelBuilder.Entity<Project>()
        //        .HasMany(x => x.LongTermGoals)
        //        .WithOne(x => x.Project);
        //}

        public DbSet<Project> Projects { get; set; }
        public DbSet<LongTermGoal> LongTermGoals { get; set; }
        public DbSet<TodoTask> TodoTasks { get; set; }
        public DbSet<Link> Links { get; set; }
        public DbSet<Column> Columns { get; set; }
    }
}
