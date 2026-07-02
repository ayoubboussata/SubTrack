using FluentValidation;
using SubTrack.Api.DTOs.Subscriptions;

namespace SubTrack.Api.Validators;

public class CreateSubscriptionRequestValidator : AbstractValidator<CreateSubscriptionRequest>
{
    public CreateSubscriptionRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MaximumLength(128);

        RuleFor(x => x.Price)
            .GreaterThanOrEqualTo(0).WithMessage("Price cannot be negative.");

        RuleFor(x => x.Currency)
            .NotEmpty().WithMessage("Currency is required.")
            .Length(3).WithMessage("Currency must be a 3-letter ISO code (e.g. EUR).");

        RuleFor(x => x.BillingCycle)
            .IsInEnum().WithMessage("Billing cycle must be Monthly or Yearly.");

        RuleFor(x => x.Category)
            .IsInEnum().WithMessage("Invalid category.");

        RuleFor(x => x.NextRenewalDate)
            .Must(date => date != default).WithMessage("Next renewal date is required.");

        RuleFor(x => x.Notes)
            .MaximumLength(1000);
    }
}
