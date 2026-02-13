using BackendApi.Data;
using BackendApi.Models;
using HotChocolate;
using HotChocolate.Execution.Configuration;
using HotChocolate.Data;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.GraphQL
{
    public class Query // get
    {
        [UseFiltering]
        [UseSorting]
        public IQueryable<Eveniment> GetEvents([Service(ServiceKind.Default)] AppDbContext context)
        {
            // Return all events; client can filter by userId or other fields
            return context.Evenimente.Include(e => e.User);
        }
        public IQueryable<User> GetUsers([Service(ServiceKind.Default)] AppDbContext context)
        {
            // Return all users
            return context.Users;
        }
    }
}
