namespace SubTrack.Api.Common.Exceptions;

/// <summary>404 Not Found — e.g. a subscription that doesn't exist or isn't owned by the user.</summary>
public class NotFoundException : AppException
{
    public override int StatusCode => StatusCodes.Status404NotFound;

    public NotFoundException(string message) : base(message)
    {
    }
}
