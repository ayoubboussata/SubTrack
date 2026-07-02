using SubTrack.Api.DTOs.Auth;

namespace SubTrack.Api.Services;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);

    Task<AuthResponse> LoginAsync(LoginRequest request);

    Task<AuthResponse> RefreshAsync(RefreshRequest request);
}
