using SubTrack.Api.Models;

namespace SubTrack.Api.Repositories;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id);

    Task<User?> GetByEmailAsync(string email);

    /// <summary>Looks up a user by the STORED (hashed) refresh token.</summary>
    Task<User?> GetByRefreshTokenAsync(string refreshTokenHash);

    Task<bool> EmailExistsAsync(string email);

    Task AddAsync(User user);

    /// <summary>Persists pending changes (e.g. after rotating a refresh token).</summary>
    Task SaveChangesAsync();
}
