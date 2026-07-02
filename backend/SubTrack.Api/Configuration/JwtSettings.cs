namespace SubTrack.Api.Configuration;

/// <summary>
/// Strongly-typed JWT settings, bound from the "Jwt" section of appsettings.json.
/// </summary>
public class JwtSettings
{
    public const string SectionName = "Jwt";

    public string Issuer { get; set; } = string.Empty;

    public string Audience { get; set; } = string.Empty;

    /// <summary>Signing key. Must be at least 32 characters for HMAC-SHA256.</summary>
    public string Key { get; set; } = string.Empty;

    public int AccessTokenMinutes { get; set; } = 15;

    public int RefreshTokenDays { get; set; } = 7;
}
