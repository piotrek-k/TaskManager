using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectManagementTool.Models;
using ProjectManagementTool.Models.DbModels;
using ProjectManagementTool.Models.DTOs;

namespace ProjectManagementTool.Controllers
{
    [Produces("application/json")]
    [Route("api/TodoTasks")]
    public class TodoTasksController : Controller
    {
        private readonly ApplicationDbContext _context;

        public TodoTasksController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/TodoTasks
        [HttpGet]
        public IEnumerable<TodoTaskDTO> GetTodoTasks()
        {
            var tasks = _context.TodoTasks;
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

            var todoTask = await _context.TodoTasks.SingleOrDefaultAsync(m => m.Id == id);

            if (todoTask == null)
            {
                return NotFound();
            }

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