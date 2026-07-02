namespace SubTrack.Api.Common.Exceptions;

/// <summary>401 Unauthorized — e.g. wrong credentials or an invalid/expired refresh token.</summary>
public class UnauthorizedException : AppException
{
    public override int StatusCode => StatusCodes.Status401Unauthorized;

    public UnauthorizedException(string message) : base(message)
    {
    }
}
