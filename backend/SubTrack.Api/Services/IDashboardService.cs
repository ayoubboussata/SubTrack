using SubTrack.Api.DTOs.Dashboard;

namespace SubTrack.Api.Services;

public interface IDashboardService
{
    Task<DashboardSummaryResponse> GetSummaryAsync(Guid userId);
}
