using SubTrack.Api.DTOs.Subscriptions;

namespace SubTrack.Api.DTOs.Dashboard;

/// <summary>
/// Aggregated view for the dashboard. All amounts consider only active subscriptions;
/// yearly subscriptions are converted to a monthly equivalent (price / 12).
/// </summary>
public record DashboardSummaryResponse(
    decimal TotalMonthlyCost,
    decimal TotalYearlyCost,
    IReadOnlyList<CategoryCost> CostPerCategory,
    IReadOnlyList<SubscriptionResponse> UpcomingRenewals);
