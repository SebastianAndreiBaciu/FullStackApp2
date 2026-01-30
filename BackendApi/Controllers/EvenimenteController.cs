using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendApi.Data;
using BackendApi.Models;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;


namespace BackendApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EvenimenteController : ControllerBase
    {
        private readonly AppDbContext _context;
        public EvenimenteController(AppDbContext context)
        {
            _context = context;
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
            return int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Eveniment>>> GetEvenimente()
        {
            var userId = GetUserId();
            Console.WriteLine("\n\n\n\n\n------------------\nUser ID from token: " + userId);
            return await _context.Evenimente
                .Where(e => e.UserId == userId)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Eveniment>> GetEveniment(int id)
        {
            var userId = GetUserId();
            var eveniment = await _context.Evenimente
                .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

            if (eveniment == null) return NotFound();
            return eveniment;
        }

        [HttpPost]
        public async Task<ActionResult<Eveniment>> CreateEveniment(Eveniment eveniment)
        {
            var userId = GetUserId();
            Console.WriteLine("\n\n\n\n\n------------------\nUser ID from token: " + userId);
            eveniment.UserId = userId;
            Console.WriteLine("User ID from token: " + eveniment);

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