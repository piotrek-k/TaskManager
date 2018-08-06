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

namespace ProjectManagementTool.Controllers
{
    [Produces("application/json")]
    [Route("api/Columns")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class ColumnsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ColumnsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Columns
        [HttpGet]
        public IEnumerable<ColumnDTO> GetColumns()
        {
            var columns = _context.Columns;
            return ColumnDTO.DbSetToDtoList(columns);
        }

        [HttpGet("GetForLTG/{ltgID}")]
        public IEnumerable<ColumnDTO> GetColumnsForLTG([FromRoute] int ltgID)
        {
            var columns = _context.Columns.Where(x=>x.LongTermGoalId == ltgID);
            return ColumnDTO.DbSetToDtoList(columns);
        }

        // GET: api/Columns/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetColumn([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var column = await _context.Columns.SingleOrDefaultAsync(m => m.Id == id);

            if (column == null)
            {
                return NotFound();
            }

            var result = ColumnDTO.DbObjectToDto(column);

            return Ok(result);
        }

        // PUT: api/Columns/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutColumn([FromRoute] int id, [FromBody] ColumnDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != dto.Id)
            {
                return BadRequest();
            }

            var column = await _context.Columns.SingleOrDefaultAsync(x => x.Id == dto.Id);

            column = ColumnDTO.UpdateDbObjectWithDTO(column, dto);

            _context.Entry(column).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ColumnExists(id))
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

        // POST: api/Columns
        [HttpPost]
        public async Task<IActionResult> PostColumn([FromBody] ColumnDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var column = ColumnDTO.UpdateDbObjectWithDTO(new Column(), dto);

            _context.Columns.Add(column);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetColumn", new { id = column.Id }, column);
        }

        // DELETE: api/Columns/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteColumn([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var column = await _context.Columns.SingleOrDefaultAsync(m => m.Id == id);
            if (column == null)
            {
                return NotFound();
            }

            _context.Columns.Remove(column);
            await _context.SaveChangesAsync();

            return Ok(column);
        }

        private bool ColumnExists(int id)
        {
            return _context.Columns.Any(e => e.Id == id);
        }
    }
}