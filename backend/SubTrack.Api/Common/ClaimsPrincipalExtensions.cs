using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace SubTrack.Api.Common;

public static class ClaimsPrincipalExtensions
{
    /// <summary>
    /// Reads the current user's id from the "sub" claim. Throws if the token is missing
    /// or malformed (which should never happen behind [Authorize]).
    /// </summary>
    public static Guid GetUserId(this ClaimsPrincipal principal)
    {
        var sub = principal.FindFirstValue(JwtRegisteredClaimNames.Sub);

        if (Guid.TryParse(sub, out var userId))
            return userId;

        throw new UnauthorizedAccessException("The access token does not contain a valid user id.");
    }
}
