using SubTrack.Api.Models;

namespace SubTrack.Api.Services;

public interface ITokenService
{
    /// <summary>Creates a signed JWT access token and returns it with its UTC expiry.</summary>
    (string Token, DateTime ExpiresAt) GenerateAccessToken(User user);

    /// <summary>Creates a cryptographically-random, opaque refresh token.</summary>
    string GenerateRefreshToken();
}
