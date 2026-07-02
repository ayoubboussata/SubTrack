using SubTrack.Api.Models.Enums;

namespace SubTrack.Api.DTOs.Subscriptions;

/// <summary>Full replacement of an existing subscription (PUT semantics).</summary>
public record UpdateSubscriptionRequest
{
    public string Name { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public string Currency { get; init; } = "EUR";
    public BillingCycle BillingCycle { get; init; }
    public DateOnly NextRenewalDate { get; init; }
    public SubscriptionCategory Category { get; init; }
    public bool IsActive { get; init; }
    public string? Notes { get; init; }
}
