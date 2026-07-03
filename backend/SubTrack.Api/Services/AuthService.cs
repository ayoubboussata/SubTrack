using Microsoft.Extensions.Options;
using SubTrack.Api.Common.Exceptions;
using SubTrack.Api.Configuration;
using SubTrack.Api.DTOs.Auth;
using SubTrack.Api.Models;
using SubTrack.Api.Repositories;

namespace SubTrack.Api.Services;

public class AuthService : IAuthService
{
    // Explicit, documented work factor (BCrypt's default is 11) so it can be raised over time.
    private const int BcryptWorkFactor = 12;

    // Used to spend the same time hashing when the email is unknown, so login response
    // timing does not reveal whether an account exists (see LoginAsync).
    private static readonly string DummyHash =
        BCrypt.Net.BCrypt.EnhancedHashPassword("timing-attack-dummy-value", BcryptWorkFactor);

    private readonly IUserRepository _users;
    private readonly ITokenService _tokens;
    private readonly JwtSettings _jwt;

    public AuthService(IUserRepository users, ITokenService tokens, IOptions<JwtSettings> jwt)
    {
        _users = users;
        _tokens = tokens;
        _jwt = jwt.Value;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        var email = Normalize(request.Email);

        if (await _users.EmailExistsAsync(email))
            throw new ConflictException("An account with this email already exists.");

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = email,
            // Enhanced API SHA-384-prehashes the password so the full value is used
            // (classic BCrypt silently truncates at 72 bytes).
            PasswordHash = BCrypt.Net.BCrypt.EnhancedHashPassword(request.Password, BcryptWorkFactor),
            CreatedAt = DateTime.UtcNow
        };

        var response = IssueTokens(user);
        await _users.AddAsync(user);
        return response;
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var email = Normalize(request.Email);
        var user = await _users.GetByEmailAsync(email);

        // Always run a hash verification (against a dummy hash when the email is unknown)
        // so the response takes the same time regardless of whether the account exists.
        var hash = user?.PasswordHash ?? DummyHash;
        var passwordValid = BCrypt.Net.BCrypt.EnhancedVerify(request.Password, hash);

        // Same generic error either way, so we don't leak which emails are registered.
        if (user is null || !passwordValid)
            throw new UnauthorizedException("Invalid email or password.");

        var response = IssueTokens(user);
        await _users.SaveChangesAsync();
        return response;
    }

    public async Task<AuthResponse> RefreshAsync(RefreshRequest request)
    {
        // The DB stores only the hash, so hash the incoming token before looking it up.
        var user = await _users.GetByRefreshTokenAsync(_tokens.HashRefreshToken(request.RefreshToken));

        if (user is null || user.RefreshTokenExpiresAt is null || user.RefreshTokenExpiresAt < DateTime.UtcNow)
            throw new UnauthorizedException("Invalid or expired refresh token.");

        // Rotate: the old refresh token is replaced inside IssueTokens.
        var response = IssueTokens(user);
        await _users.SaveChangesAsync();
        return response;
    }

    public async Task LogoutAsync(Guid userId)
    {
        var user = await _users.GetByIdAsync(userId);
        if (user is null)
            return;

        user.RefreshToken = null;
        user.RefreshTokenExpiresAt = null;
        await _users.SaveChangesAsync();
    }

    /// <summary>
    /// Generates a fresh access + refresh token pair. The raw refresh token is returned to the
    /// client; only its hash is stored on the user. The caller persists (Add / SaveChanges).
    /// </summary>
    private AuthResponse IssueTokens(User user)
    {
        var (accessToken, accessExpires) = _tokens.GenerateAccessToken(user);
        var refreshToken = _tokens.GenerateRefreshToken();

        user.RefreshToken = _tokens.HashRefreshToken(refreshToken);
        user.RefreshTokenExpiresAt = DateTime.UtcNow.AddDays(_jwt.RefreshTokenDays);

        return new AuthResponse(accessToken, refreshToken, accessExpires, user.Email);
    }

    private static string Normalize(string email) => email.Trim().ToLowerInvariant();
}
