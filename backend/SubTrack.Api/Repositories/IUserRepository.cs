using SubTrack.Api.Models;

namespace SubTrack.Api.Repositories;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);

    Task<User?> GetByRefreshTokenAsync(string refreshToken);

    Task<bool> EmailExistsAsync(string email);

    Task AddAsync(User user);

    /// <summary>Persists pending changes (e.g. after rotating a refresh token).</summary>
    Task SaveChangesAsync();
}
