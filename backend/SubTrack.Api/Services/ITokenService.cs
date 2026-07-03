using SubTrack.Api.Models;

namespace SubTrack.Api.Services;

public interface ITokenService
{
    /// <summary>Creates a signed JWT access token and returns it with its UTC expiry.</summary>
    (string Token, DateTime ExpiresAt) GenerateAccessToken(User user);

    /// <summary>Creates a cryptographically-random, opaque refresh token (returned to the client).</summary>
    string GenerateRefreshToken();

    /// <summary>
    /// Hashes a refresh token for storage/lookup. The DB never holds the raw token, so a
    /// leaked Users table cannot be replayed. SHA-256 is sufficient here because the token
    /// is 512 bits of CSPRNG entropy (not a guessable password).
    /// </summary>
    string HashRefreshToken(string refreshToken);
}
