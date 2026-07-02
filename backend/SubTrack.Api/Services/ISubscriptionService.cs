using SubTrack.Api.DTOs.Subscriptions;
using SubTrack.Api.Models.Enums;

namespace SubTrack.Api.Services;

public interface ISubscriptionService
{
    Task<List<SubscriptionResponse>> GetAllAsync(Guid userId, SubscriptionCategory? category, bool? isActive);

    Task<SubscriptionResponse> GetByIdAsync(Guid userId, Guid id);

    Task<SubscriptionResponse> CreateAsync(Guid userId, CreateSubscriptionRequest request);

    Task<SubscriptionResponse> UpdateAsync(Guid userId, Guid id, UpdateSubscriptionRequest request);

    Task DeleteAsync(Guid userId, Guid id);
}
