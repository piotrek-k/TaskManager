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
    [Route("api/Links")]
    public class LinksController : Controller
    {
        private readonly ApplicationDbContext _context;

        public LinksController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Links
        [HttpGet]
        public IEnumerable<LinkDTO> GetLinks()
        {
            var links = _context.Links;
            return LinkDTO.DbSetToDtoList(links);
        }

        // GET: api/Links/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetLink([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var link = await _context.Links.SingleOrDefaultAsync(m => m.Id == id);

            if (link == null)
            {
                return NotFound();
            }

            var result = LinkDTO.DbObjectToDto(link);

            return Ok(result);
        }

        // PUT: api/Links/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLink([FromRoute] int id, [FromBody] LinkDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != dto.Id)
            {
                return BadRequest();
            }

            var link = await _context.Links.SingleOrDefaultAsync(x => x.Id == dto.Id);

            link = LinkDTO.UpdateDbObjectWithDTO(link, dto);

            _context.Entry(link).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LinkExists(id))
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

        // POST: api/Links
        [HttpPost]
        public async Task<IActionResult> PostLink([FromBody] LinkDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var link = LinkDTO.UpdateDbObjectWithDTO(new Link(), dto);

            _context.Links.Add(link);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLink", new { id = link.Id }, link);
        }

        // DELETE: api/Links/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLink([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var link = await _context.Links.SingleOrDefaultAsync(m => m.Id == id);
            if (link == null)
            {
                return NotFound();
            }

            _context.Links.Remove(link);
            await _context.SaveChangesAsync();

            return Ok(link);
        }

        private bool LinkExists(int id)
        {
            return _context.Links.Any(e => e.Id == id);
        }
    }
}