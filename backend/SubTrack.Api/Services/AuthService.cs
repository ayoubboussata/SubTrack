using Microsoft.Extensions.Options;
using SubTrack.Api.Common.Exceptions;
using SubTrack.Api.Configuration;
using SubTrack.Api.DTOs.Auth;
using SubTrack.Api.Models;
using SubTrack.Api.Repositories;

namespace SubTrack.Api.Services;

public class AuthService : IAuthService
{
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
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
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

        // Same generic error whether the email is unknown or the password is wrong,
        // so we don't leak which emails are registered.
        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new UnauthorizedException("Invalid email or password.");

        var response = IssueTokens(user);
        await _users.SaveChangesAsync();
        return response;
    }

    public async Task<AuthResponse> RefreshAsync(RefreshRequest request)
    {
        var user = await _users.GetByRefreshTokenAsync(request.RefreshToken);

        if (user is null || user.RefreshTokenExpiresAt is null || user.RefreshTokenExpiresAt < DateTime.UtcNow)
            throw new UnauthorizedException("Invalid or expired refresh token.");

        // Rotate: the old refresh token is replaced inside IssueTokens.
        var response = IssueTokens(user);
        await _users.SaveChangesAsync();
        return response;
    }

    /// <summary>
    /// Generates a fresh access + refresh token pair and stores the refresh token on the user.
    /// The caller is responsible for persisting (Add for new users, SaveChanges for existing).
    /// </summary>
    private AuthResponse IssueTokens(User user)
    {
        var (accessToken, accessExpires) = _tokens.GenerateAccessToken(user);
        var refreshToken = _tokens.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiresAt = DateTime.UtcNow.AddDays(_jwt.RefreshTokenDays);

        return new AuthResponse(accessToken, refreshToken, accessExpires, user.Email);
    }

    private static string Normalize(string email) => email.Trim().ToLowerInvariant();
}
