using EnterpriseAPI.Data;
using EnterpriseAPI.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace EnterpriseAPI.Services;

public class DashboardService : IDashboardService
{
    private readonly ApplicationDbContext _context;

    public DashboardService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardStats> GetDashboardStatsAsync()
    {
        var totalUsers = await _context.Users.CountAsync();
        var activeUsers = await _context.Users.CountAsync(u => u.IsActive);

        var startOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
        var newUsersThisMonth = await _context.Users
            .CountAsync(u => u.CreatedAt >= startOfMonth);

        // User activity for last 7 days
        var last7Days = Enumerable.Range(0, 7)
            .Select(i => DateTime.UtcNow.Date.AddDays(-i))
            .Reverse()
            .ToList();

        var userActivityData = last7Days.Select(date => new UserActivityData
        {
            Date = date.ToString("MMM dd"),
            Count = _context.Users.Count(u => u.CreatedAt.Date == date)
        }).ToList();

        // Role distribution
        var roleDistribution = await _context.Users
            .GroupBy(u => u.Role)
            .Select(g => new RoleDistribution
            {
                Role = g.Key,
                Count = g.Count()
            })
            .ToListAsync();

        return new DashboardStats
        {
            TotalUsers = totalUsers,
            ActiveUsers = activeUsers,
            NewUsersThisMonth = newUsersThisMonth,
            UserActivityChart = userActivityData,
            RoleDistribution = roleDistribution
        };
    }

    public async Task<List<UserDto>> GetAllUsersAsync()
    {
        return await _context.Users
            .Select(u => new UserDto
            {
                Id = u.Id,
                Email = u.Email,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Role = u.Role,
                CreatedAt = u.CreatedAt,
                LastLoginAt = u.LastLoginAt,
                IsActive = u.IsActive
            })
            .ToListAsync();
    }

    public async Task<UserDto?> GetUserByIdAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return null;

        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = user.Role,
            CreatedAt = user.CreatedAt,
            LastLoginAt = user.LastLoginAt,
            IsActive = user.IsActive
        };
    }
}
