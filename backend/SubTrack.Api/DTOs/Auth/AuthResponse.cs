namespace SubTrack.Api.DTOs.Auth;

/// <summary>
/// Returned by register, login and refresh. Contains the short-lived access token
/// and the long-lived refresh token used to obtain a new pair.
/// </summary>
public record AuthResponse(
    string AccessToken,
    string RefreshToken,
    DateTime AccessTokenExpiresAt,
    string Email);
