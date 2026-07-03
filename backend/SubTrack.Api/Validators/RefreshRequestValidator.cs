using FluentValidation;
using SubTrack.Api.DTOs.Auth;

namespace SubTrack.Api.Validators;

public class RefreshRequestValidator : AbstractValidator<RefreshRequest>
{
    public RefreshRequestValidator()
    {
        RuleFor(x => x.RefreshToken)
            .NotEmpty().WithMessage("Refresh token is required.")
            .MaximumLength(512);
    }
}
