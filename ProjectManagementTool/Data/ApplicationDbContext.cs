using Microsoft.EntityFrameworkCore;
using ProjectManagementTool.Interfaces;
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

        /// <summary>
        /// Modified version of EF SaveChanges method. Runs additional query modifications.
        /// </summary>
        /// <returns></returns>
        public override int SaveChanges()
        {
            KeepLastModificationDateUpdated();
            return base.SaveChanges();
        }

        /// <summary>
        /// Runs methods responsible for consistency of LastModified value
        /// </summary>
        public void KeepLastModificationDateUpdated()
        {
            var entires = ChangeTracker.Entries<ILastModificationTracking>();
            foreach(var entry in entires)
            {
                entry.Entity.KeepParentsLastModificationValueUpdated();
            }
        }
    }
}
