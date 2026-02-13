using BackendApi.Data;
using BackendApi.Models;
using HotChocolate;
using HotChocolate.Types;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.GraphQL
{
    public class Mutation // adaugarea
    {
        public async Task<Eveniment> CreateEvenimentAsync(
            CreateEvenimentDto input,
            [Service] AppDbContext context,
            [Service] IHttpContextAccessor httpContextAccessor)
        {
            var userIdClaim = httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) throw new GraphQLException("Unauthorized");
            var userId = int.Parse(userIdClaim);

            var eveniment = new Eveniment
            {
                Nume = input.Nume,
                Data = input.Data,
                Locatie = input.Locatie,
                UserId = userId
            };

            context.Evenimente.Add(eveniment);
            await context.SaveChangesAsync();
            return eveniment;
        }

        public async Task<Eveniment?> UpdateEvenimentAsync(
            int id,
            CreateEvenimentDto input,
            [Service] AppDbContext context,
            [Service] IHttpContextAccessor httpContextAccessor)
        {
            var userIdClaim = httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) throw new GraphQLException("Unauthorized");
            var userId = int.Parse(userIdClaim);

            var eveniment = await context.Evenimente.FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);
            if (eveniment == null) throw new GraphQLException("Event not found");

            eveniment.Nume = input.Nume;
            eveniment.Data = input.Data;
            eveniment.Locatie = input.Locatie;

            await context.SaveChangesAsync();
            return eveniment;
        }

        public async Task<bool> DeleteEvenimentAsync(
            int id,
            [Service] AppDbContext context,
            [Service] IHttpContextAccessor httpContextAccessor)
        {
            var userIdClaim = httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) throw new GraphQLException("Unauthorized");
            var userId = int.Parse(userIdClaim);

            var eveniment = await context.Evenimente.FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);
            if (eveniment == null) throw new GraphQLException("Event not found");

            context.Evenimente.Remove(eveniment);
            await context.SaveChangesAsync();
            return true;
        }
    }
}
