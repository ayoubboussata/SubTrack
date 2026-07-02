namespace SubTrack.Api.Models;

public class User
{
    public Guid Id { get; set; }

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    // Refresh-token state (single active refresh token per user for v1).
    public string? RefreshToken { get; set; }

    public DateTime? RefreshTokenExpiresAt { get; set; }

    // Navigation
    public ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
}
