using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendApi.Data;
using BackendApi.Models;
using Microsoft.AspNetCore.Authorization;

namespace BackendApi.Controllers
{
    [Authorize] // 🔒 toate endpoint-urile necesită token
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.Include(u => u.Eveniments).ToListAsync();
        }
        
        [AllowAnonymous] // 👈 Dacă vrei să permiti crearea user-ului fără autentificare
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.Include(u => u.Eveniments).FirstOrDefaultAsync(u => u.Id == id);
            if (user == null) return NotFound();
            return user;
        }

        [HttpPost]
        [AllowAnonymous] // 👈 Dacă vrei să permiti crearea user-ului fără autentificare
        public async Task<ActionResult<User>> CreateUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, User user)
        {
            if (id != user.Id) return BadRequest();
            _context.Entry(user).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Users.Any(e => e.Id == id))
                    return NotFound();
                else
                    throw;
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}