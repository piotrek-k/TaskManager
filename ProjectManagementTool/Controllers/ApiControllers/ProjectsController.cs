using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectManagementTool.Controllers.ApiControllers;
using ProjectManagementTool.Models;
using ProjectManagementTool.Models.DbModels;
using ProjectManagementTool.Models.DTOs;

namespace ProjectManagementTool.Controllers
{
    [Produces("application/json")]
    [Route("api/Projects")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class ProjectsController : _BaseController
    {
        public ProjectsController(ApplicationDbContext context, UserManager<ApplicationUser> manager) : base(context, manager)
        {
        }

        // GET: api/Projects
        [HttpGet]
        public async Task<IEnumerable<ProjectDTO>> GetProjectsAsync()
        {
            //return _context.Projects.Include(x=>x.LongTermGoals).Include(x=>x.Links);
            var currentUser = await GetCurrentUserAsync();
            var projects = _context.Projects.Where(x => x.OwnerId == currentUser.Id);

            try
            {
                await EnsureAuthorizedAccessAsync(projects);
            }
            catch (Exception)
            {
                return null;
            }

            return ProjectDTO.DbSetToDtoList(projects);
        }

        // GET: api/Projects
        [HttpGet("MostRecent")]
        public async Task<IEnumerable<ProjectDTO>> GetMostRecentAsync()
        {
            var currentUser = await GetCurrentUserAsync();
            var projects = _context.Projects.Where(x => !x.Archived && x.OwnerId == currentUser.Id).OrderByDescending(x => x.LastModified).Take(10);

            try
            {
                await EnsureAuthorizedAccessAsync(projects);
            }
            catch (Exception)
            {
                return null;
            }

            return ProjectDTO.DbSetToDtoList(projects);
        }

        // GET: api/Projects/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProject([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var project = await _context.Projects.SingleOrDefaultAsync(m => m.Id == id);

            if (project == null)
            {
                return NotFound();
            }

            try
            {
                await EnsureAuthorizedAccessAsync(project);
            }
            catch (Exception)
            {
                return Unauthorized();
            }

            var result = ProjectDTO.DbObjectToDto(project);

            return Ok(result);
        }

        // PUT: api/Projects/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProject([FromRoute] int id, [FromBody] ProjectDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != dto.Id)
            {
                return BadRequest();
            }

            var project = await _context.Projects.SingleOrDefaultAsync(x => x.Id == dto.Id);
            try
            {
                await EnsureAuthorizedAccessAsync(project);
            }
            catch (Exception)
            {
                return Unauthorized();
            }

            project = ProjectDTO.UpdateDbObjectWithDTO(project, dto);

            _context.Entry(project).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjectExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Projects
        [HttpPost]
        public async Task<IActionResult> PostProject([FromBody] ProjectDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var project = ProjectDTO.UpdateDbObjectWithDTO(new Project(), dto);
            var currentUser = await GetCurrentUserAsync();
            project.OwnerId = currentUser.Id;

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProject", new { id = project.Id }, project);
        }

        // DELETE: api/Projects/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var project = await _context.Projects.SingleOrDefaultAsync(m => m.Id == id);
            if (project == null)
            {
                return NotFound();
            }
            try
            {
                await EnsureAuthorizedAccessAsync(project);
            }
            catch (Exception)
            {
                return Unauthorized();
            }

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return Ok(project);
        }

        private bool ProjectExists(int id)
        {
            return _context.Projects.Any(e => e.Id == id);
        }
    }
}