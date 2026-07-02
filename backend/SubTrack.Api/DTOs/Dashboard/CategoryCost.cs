using SubTrack.Api.Models.Enums;

namespace SubTrack.Api.DTOs.Dashboard;

/// <summary>Monthly-equivalent cost for a single category (for the pie chart).</summary>
public record CategoryCost(SubscriptionCategory Category, decimal MonthlyCost);
