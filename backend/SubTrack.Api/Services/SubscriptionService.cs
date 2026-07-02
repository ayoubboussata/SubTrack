using SubTrack.Api.Common.Exceptions;
using SubTrack.Api.DTOs.Subscriptions;
using SubTrack.Api.Models;
using SubTrack.Api.Models.Enums;
using SubTrack.Api.Repositories;

namespace SubTrack.Api.Services;

public class SubscriptionService : ISubscriptionService
{
    private readonly ISubscriptionRepository _subscriptions;

    public SubscriptionService(ISubscriptionRepository subscriptions)
    {
        _subscriptions = subscriptions;
    }

    public async Task<List<SubscriptionResponse>> GetAllAsync(Guid userId, SubscriptionCategory? category, bool? isActive)
    {
        var items = await _subscriptions.GetForUserAsync(userId, category, isActive);
        return items.Select(ToResponse).ToList();
    }

    public async Task<SubscriptionResponse> GetByIdAsync(Guid userId, Guid id)
    {
        var subscription = await GetOwnedOrThrowAsync(userId, id);
        return ToResponse(subscription);
    }

    public async Task<SubscriptionResponse> CreateAsync(Guid userId, CreateSubscriptionRequest request)
    {
        var now = DateTime.UtcNow;
        var subscription = new Subscription
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = request.Name.Trim(),
            Price = request.Price,
            Currency = request.Currency.ToUpperInvariant(),
            BillingCycle = request.BillingCycle,
            NextRenewalDate = request.NextRenewalDate,
            Category = request.Category,
            IsActive = request.IsActive,
            Notes = request.Notes,
            CreatedAt = now,
            UpdatedAt = now
        };

        await _subscriptions.AddAsync(subscription);
        return ToResponse(subscription);
    }

    public async Task<SubscriptionResponse> UpdateAsync(Guid userId, Guid id, UpdateSubscriptionRequest request)
    {
        var subscription = await GetOwnedOrThrowAsync(userId, id);

        subscription.Name = request.Name.Trim();
        subscription.Price = request.Price;
        subscription.Currency = request.Currency.ToUpperInvariant();
        subscription.BillingCycle = request.BillingCycle;
        subscription.NextRenewalDate = request.NextRenewalDate;
        subscription.Category = request.Category;
        subscription.IsActive = request.IsActive;
        subscription.Notes = request.Notes;
        subscription.UpdatedAt = DateTime.UtcNow;

        await _subscriptions.SaveChangesAsync();
        return ToResponse(subscription);
    }

    public async Task DeleteAsync(Guid userId, Guid id)
    {
        var subscription = await GetOwnedOrThrowAsync(userId, id);
        _subscriptions.Remove(subscription);
        await _subscriptions.SaveChangesAsync();
    }

    /// <summary>
    /// Loads a subscription scoped to the current user, or throws 404.
    /// Returning "not found" (rather than "forbidden") for someone else's subscription
    /// avoids revealing that the id exists.
    /// </summary>
    private async Task<Subscription> GetOwnedOrThrowAsync(Guid userId, Guid id)
    {
        var subscription = await _subscriptions.GetByIdForUserAsync(id, userId);
        if (subscription is null)
            throw new NotFoundException("Subscription not found.");
        return subscription;
    }

    private static SubscriptionResponse ToResponse(Subscription s) => new(
        s.Id,
        s.Name,
        s.Price,
        s.Currency,
        s.BillingCycle,
        s.NextRenewalDate,
        s.Category,
        s.IsActive,
        s.Notes,
        s.CreatedAt,
        s.UpdatedAt);
}
