namespace SubTrack.Api.Common.Exceptions;

/// <summary>409 Conflict — e.g. registering an email that already exists.</summary>
public class ConflictException : AppException
{
    public override int StatusCode => StatusCodes.Status409Conflict;

    public ConflictException(string message) : base(message)
    {
    }
}
