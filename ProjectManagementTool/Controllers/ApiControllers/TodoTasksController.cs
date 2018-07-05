using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectManagementTool.Models;
using ProjectManagementTool.Models.DbModels;
using ProjectManagementTool.Models.DTOs;
using Microsoft.AspNetCore.Identity;
using ProjectManagementTool.Controllers.ApiControllers;

namespace ProjectManagementTool.Controllers
{
    [Produces("application/json")]
    [Route("api/TodoTasks")]
    [Authorize]
    public class TodoTasksController : _BaseController
    {

        public TodoTasksController(ApplicationDbContext context, UserManager<ApplicationUser> manager): base(context, manager)
        {
        }

        // GET: api/TodoTasks
        [HttpGet]
        public async Task<IEnumerable<TodoTaskDTO>> GetTodoTasksAsync()
        {
            var currentUser = await GetCurrentUserAsync();
            var tasks = _context.TodoTasks.Where(x => x.OwnerId == currentUser.Id);

            await EnsureAuthorizedAccessAsync(tasks);
            return TodoTaskDTO.DbSetToDtoList(tasks);
        }

        // GET: api/TodoTasks/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTodoTask([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var currentUser = await GetCurrentUserAsync();
            var todoTask = await _context.TodoTasks.SingleOrDefaultAsync(m => m.Id == id);

            if (todoTask == null)
            {
                return NotFound();
            }

            await EnsureAuthorizedAccessAsync(todoTask);

            var result = TodoTaskDTO.DbObjectToDto(todoTask);

            return Ok(result);
        }

        // PUT: api/TodoTasks/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTodoTask([FromRoute] int id, [FromBody] TodoTaskDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != dto.Id)
            {
                return BadRequest();
            }

            var task = await _context.TodoTasks.SingleOrDefaultAsync(x => x.Id == dto.Id);
            await EnsureAuthorizedAccessAsync(task);

            task = TodoTaskDTO.UpdateDbObjectWithDTO(task, dto);

            _context.Entry(task).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TodoTaskExists(id))
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

        // POST: api/TodoTasks
        [HttpPost]
        public async Task<IActionResult> PostTodoTask([FromBody] TodoTaskDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var task = TodoTaskDTO.UpdateDbObjectWithDTO(new TodoTask(), dto);
            var currentUser = await GetCurrentUserAsync();
            task.OwnerId = currentUser.Id;

            _context.TodoTasks.Add(task);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTodoTask", new { id = task.Id }, task);
        }

        // DELETE: api/TodoTasks/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodoTask([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var todoTask = await _context.TodoTasks.SingleOrDefaultAsync(m => m.Id == id);
            await EnsureAuthorizedAccessAsync(todoTask);

            if (todoTask == null)
            {
                return NotFound();
            }

            _context.TodoTasks.Remove(todoTask);
            await _context.SaveChangesAsync();

            return Ok(todoTask);
        }

        private bool TodoTaskExists(int id)
        {
            return _context.TodoTasks.Any(e => e.Id == id);
        }
    }
}