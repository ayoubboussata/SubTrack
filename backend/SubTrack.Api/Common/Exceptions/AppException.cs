namespace SubTrack.Api.Common.Exceptions;

/// <summary>
/// Base class for expected, "business" errors that map to a specific HTTP status code.
/// The exception-handling middleware turns these into ProblemDetails responses.
/// </summary>
public abstract class AppException : Exception
{
    public abstract int StatusCode { get; }

    protected AppException(string message) : base(message)
    {
    }
}
