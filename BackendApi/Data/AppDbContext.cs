using Microsoft.EntityFrameworkCore;
using BackendApi.Models;

namespace BackendApi.Data
{
    public class AppDbContext : DbContext //extind clasa DbContext din Entity Framework, entity framework este libraria care a ajuta sa fac crud cu baza de date
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { } // constructor default

        public DbSet<User> Users { get; set; } // definesc tabelul meu Users in baza de date
        public DbSet<Eveniment> Evenimente { get; set; } // definesc tabelul meu Evenimente in baza de date
    }
}