using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using SubTrack.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// --- Services ---

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Serialize enums as their string names (e.g. "Monthly") instead of ints.
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

// EF Core + PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// --- HTTP pipeline ---

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
