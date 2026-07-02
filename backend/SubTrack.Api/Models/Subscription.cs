using SubTrack.Api.Models.Enums;

namespace SubTrack.Api.Models;

public class Subscription
{
    public Guid Id { get; set; }

    // Owner
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public string Name { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public string Currency { get; set; } = "EUR";

    public BillingCycle BillingCycle { get; set; }

    public DateOnly NextRenewalDate { get; set; }

    public SubscriptionCategory Category { get; set; }

    public bool IsActive { get; set; } = true;

    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
