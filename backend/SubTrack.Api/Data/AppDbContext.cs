using Microsoft.EntityFrameworkCore;
using SubTrack.Api.Models;

namespace SubTrack.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Subscription> Subscriptions => Set<Subscription>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(user =>
        {
            user.HasKey(u => u.Id);

            user.Property(u => u.Email)
                .IsRequired()
                .HasMaxLength(256);

            user.HasIndex(u => u.Email)
                .IsUnique();

            user.Property(u => u.PasswordHash)
                .IsRequired();

            user.Property(u => u.RefreshToken)
                .HasMaxLength(512);

            user.HasMany(u => u.Subscriptions)
                .WithOne(s => s.User)
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Subscription>(sub =>
        {
            sub.HasKey(s => s.Id);

            sub.Property(s => s.Name)
                .IsRequired()
                .HasMaxLength(128);

            sub.Property(s => s.Price)
                .HasPrecision(18, 2);

            sub.Property(s => s.Currency)
                .IsRequired()
                .HasMaxLength(3)
                .HasDefaultValue("EUR");

            // Store enums as readable strings instead of ints.
            sub.Property(s => s.BillingCycle)
                .HasConversion<string>()
                .HasMaxLength(16);

            sub.Property(s => s.Category)
                .HasConversion<string>()
                .HasMaxLength(32);

            sub.Property(s => s.Notes)
                .HasMaxLength(1000);

            sub.HasIndex(s => s.UserId);
        });
    }
}
