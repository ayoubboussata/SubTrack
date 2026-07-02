using SubTrack.Api.Common.Mapping;
using SubTrack.Api.DTOs.Dashboard;
using SubTrack.Api.Models;
using SubTrack.Api.Models.Enums;
using SubTrack.Api.Repositories;

namespace SubTrack.Api.Services;

public class DashboardService : IDashboardService
{
    private const int UpcomingWindowDays = 30;

    private readonly ISubscriptionRepository _subscriptions;

    public DashboardService(ISubscriptionRepository subscriptions)
    {
        _subscriptions = subscriptions;
    }

    public async Task<DashboardSummaryResponse> GetSummaryAsync(Guid userId)
    {
        // Only active subscriptions count towards costs and renewals.
        var active = await _subscriptions.GetForUserAsync(userId, category: null, isActive: true);

        var totalMonthly = Round(active.Sum(MonthlyCost));
        var totalYearly = Round(totalMonthly * 12);

        var costPerCategory = active
            .GroupBy(s => s.Category)
            .Select(g => new CategoryCost(g.Key, Round(g.Sum(MonthlyCost))))
            .OrderByDescending(c => c.MonthlyCost)
            .ToList();

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var horizon = today.AddDays(UpcomingWindowDays);

        var upcomingRenewals = active
            .Where(s => s.NextRenewalDate >= today && s.NextRenewalDate <= horizon)
            .OrderBy(s => s.NextRenewalDate)
            .Select(s => s.ToResponse())
            .ToList();

        return new DashboardSummaryResponse(totalMonthly, totalYearly, costPerCategory, upcomingRenewals);
    }

    /// <summary>Monthly-equivalent cost: yearly subscriptions are divided by 12.</summary>
    private static decimal MonthlyCost(Subscription s) =>
        s.BillingCycle == BillingCycle.Yearly ? s.Price / 12m : s.Price;

    private static decimal Round(decimal value) =>
        Math.Round(value, 2, MidpointRounding.AwayFromZero);
}
