using Microsoft.EntityFrameworkCore;
using SubTrack.Api.Data;
using SubTrack.Api.Models;
using SubTrack.Api.Models.Enums;

namespace SubTrack.Api.Repositories;

public class SubscriptionRepository : ISubscriptionRepository
{
    private readonly AppDbContext _db;

    public SubscriptionRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<Subscription>> GetForUserAsync(Guid userId, SubscriptionCategory? category, bool? isActive)
    {
        // Ownership is enforced here: the query is always scoped to the current user.
        var query = _db.Subscriptions
            .Where(s => s.UserId == userId);

        if (category.HasValue)
            query = query.Where(s => s.Category == category.Value);

        if (isActive.HasValue)
            query = query.Where(s => s.IsActive == isActive.Value);

        return await query
            .OrderBy(s => s.NextRenewalDate)
            .ToListAsync();
    }

    public Task<Subscription?> GetByIdForUserAsync(Guid id, Guid userId) =>
        _db.Subscriptions.FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);

    public async Task AddAsync(Subscription subscription)
    {
        await _db.Subscriptions.AddAsync(subscription);
        await _db.SaveChangesAsync();
    }

    public void Remove(Subscription subscription) => _db.Subscriptions.Remove(subscription);

    public Task SaveChangesAsync() => _db.SaveChangesAsync();
}
