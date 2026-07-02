using SubTrack.Api.DTOs.Subscriptions;
using SubTrack.Api.Models;

namespace SubTrack.Api.Common.Mapping;

public static class SubscriptionMapping
{
    public static SubscriptionResponse ToResponse(this Subscription s) => new(
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
