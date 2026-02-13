using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendApi.Data;
using BackendApi.Models;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.Extensions.Logging;


namespace BackendApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EvenimenteController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<EvenimenteController> _logger;
        public EvenimenteController(AppDbContext context, ILogger<EvenimenteController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // private int GetUserId()
        // {
        //     foreach (var claim in User.Claims)
        //     {
        //         Console.WriteLine($"{claim.Type} = {claim.Value}");
        //     }
        //     var sub = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        //     Console.WriteLine("\n\n\n\n\n------------------\nUser ID from token: " + typeof(User));
        //     Console.WriteLine("\n\n\n\n\n------------------\nUser ID from token: " + sub);
        //     return int.Parse(sub!);
        // }

        private int GetUserId()
        {
            _logger.LogDebug("GetUserId() called");
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Eveniment>>> GetEvenimente()
        {
            var userId = GetUserId();
            return await _context.Evenimente
                .Include(e => e.User)
                .Where(e => e.UserId == userId)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Eveniment>> GetEveniment(int id)
        {
            var userId = GetUserId();
            var eveniment = await _context.Evenimente
                .Include(e => e.User)
                .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

            if (eveniment == null) return NotFound();
            return eveniment;
        }

        [HttpPost]
        public async Task<ActionResult<Eveniment>> CreateEveniment(CreateEvenimentDto dto)
        {
            var userId = GetUserId();
            _logger.LogDebug("Creating event for user {UserId}", userId);

            var eveniment = new Eveniment
            {
                Nume = dto.Nume,
                Data = dto.Data,
                Locatie = dto.Locatie,
                UserId = userId
            };

            _context.Evenimente.Add(eveniment);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetEveniment), new { id = eveniment.Id }, eveniment);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEveniment(int id, Eveniment eveniment)
        {
            var userId = GetUserId();

            var existing = await _context.Evenimente
                .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

            if (existing == null) return NotFound();

            existing.Nume = eveniment.Nume;
            existing.Data = eveniment.Data;
            existing.Locatie = eveniment.Locatie;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEveniment(int id)
        {
            var userId = GetUserId();

            var eveniment = await _context.Evenimente
                .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

            if (eveniment == null) return NotFound();

            _context.Evenimente.Remove(eveniment);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}