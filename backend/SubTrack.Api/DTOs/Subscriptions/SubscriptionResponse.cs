using SubTrack.Api.Models.Enums;

namespace SubTrack.Api.DTOs.Subscriptions;

public record SubscriptionResponse(
    Guid Id,
    string Name,
    decimal Price,
    string Currency,
    BillingCycle BillingCycle,
    DateOnly NextRenewalDate,
    SubscriptionCategory Category,
    bool IsActive,
    string? Notes,
    DateTime CreatedAt,
    DateTime UpdatedAt);
