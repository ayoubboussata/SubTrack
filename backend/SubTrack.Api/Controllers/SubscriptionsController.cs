using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SubTrack.Api.Common;
using SubTrack.Api.DTOs.Subscriptions;
using SubTrack.Api.Models.Enums;
using SubTrack.Api.Services;

namespace SubTrack.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/subscriptions")]
public class SubscriptionsController : ControllerBase
{
    private readonly ISubscriptionService _subscriptions;

    public SubscriptionsController(ISubscriptionService subscriptions)
    {
        _subscriptions = subscriptions;
    }

    [HttpGet]
    public async Task<ActionResult<List<SubscriptionResponse>>> GetAll(
        [FromQuery] SubscriptionCategory? category,
        [FromQuery] bool? isActive)
    {
        var result = await _subscriptions.GetAllAsync(User.GetUserId(), category, isActive);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<SubscriptionResponse>> GetById(Guid id)
    {
        var result = await _subscriptions.GetByIdAsync(User.GetUserId(), id);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<SubscriptionResponse>> Create(CreateSubscriptionRequest request)
    {
        var created = await _subscriptions.CreateAsync(User.GetUserId(), request);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<SubscriptionResponse>> Update(Guid id, UpdateSubscriptionRequest request)
    {
        var updated = await _subscriptions.UpdateAsync(User.GetUserId(), id, request);
        return Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _subscriptions.DeleteAsync(User.GetUserId(), id);
        return NoContent();
    }
}
