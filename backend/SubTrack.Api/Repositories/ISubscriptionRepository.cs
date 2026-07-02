using SubTrack.Api.Models;
using SubTrack.Api.Models.Enums;

namespace SubTrack.Api.Repositories;

public interface ISubscriptionRepository
{
    Task<List<Subscription>> GetForUserAsync(Guid userId, SubscriptionCategory? category, bool? isActive);

    Task<Subscription?> GetByIdForUserAsync(Guid id, Guid userId);

    Task AddAsync(Subscription subscription);

    void Remove(Subscription subscription);

    Task SaveChangesAsync();
}
