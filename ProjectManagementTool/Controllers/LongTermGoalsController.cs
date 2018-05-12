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
    [Route("api/LongTermGoals")]
    public class LongTermGoalsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public LongTermGoalsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/LongTermGoals
        [HttpGet]
        public IEnumerable<LongTermGoalDTO> GetLongTermGoals()
        {
            var ltgs = _context.LongTermGoals;
            return LongTermGoalDTO.DbSetToDtoList(ltgs);
        }

        // GET: api/LongTermGoals/GetManyByProjectId/{id}
        [HttpGet("GetManyByProjectId/{id}")]
        public IEnumerable<LongTermGoalDTO> GetManyByProjectId([FromRoute] int id)
        {
            var ltgs = _context.LongTermGoals.Where(x => x.ProjectId == id);
            return LongTermGoalDTO.DbSetToDtoList(ltgs);
        }

        // GET: api/LongTermGoals/GetMostRecent
        [HttpGet("GetMostRecent")]
        public IEnumerable<LongTermGoalDTO> GetMostRecent()
        {
            var ltgs = _context.LongTermGoals.OrderByDescending(x => x.LastModified).Take(10);
            return LongTermGoalDTO.DbSetToDtoList(ltgs);
        }

        // GET: api/LongTermGoals/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetLongTermGoal([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var longTermGoal = await _context.LongTermGoals.SingleOrDefaultAsync(m => m.Id == id);

            if (longTermGoal == null)
            {
                return NotFound();
            }

            var result = LongTermGoalDTO.DbObjectToDto(longTermGoal);

            return Ok(result);
        }

        // PUT: api/LongTermGoals/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLongTermGoal([FromRoute] int id, [FromBody] LongTermGoalDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != dto.Id)
            {
                return BadRequest();
            }

            var ltg = await _context.LongTermGoals.SingleOrDefaultAsync(x => x.Id == dto.Id);

            ltg = LongTermGoalDTO.UpdateDbObjectWithDTO(ltg, dto);

            _context.Entry(ltg).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LongTermGoalExists(id))
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

        // POST: api/LongTermGoals
        [HttpPost]
        public async Task<IActionResult> PostLongTermGoal([FromBody] LongTermGoalDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var ltg = LongTermGoalDTO.UpdateDbObjectWithDTO(new LongTermGoal(), dto);

            _context.LongTermGoals.Add(ltg);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLongTermGoal", new { id = ltg.Id }, LongTermGoalDTO.DbObjectToDto(ltg));
        }

        // DELETE: api/LongTermGoals/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLongTermGoal([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var longTermGoal = await _context.LongTermGoals.SingleOrDefaultAsync(m => m.Id == id);
            if (longTermGoal == null)
            {
                return NotFound();
            }

            _context.LongTermGoals.Remove(longTermGoal);
            await _context.SaveChangesAsync();

            return Ok(longTermGoal);
        }

        private bool LongTermGoalExists(int id)
        {
            return _context.LongTermGoals.Any(e => e.Id == id);
        }
    }
}