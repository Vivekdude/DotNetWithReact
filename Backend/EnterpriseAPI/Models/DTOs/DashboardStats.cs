namespace EnterpriseAPI.Models.DTOs;

public class DashboardStats
{
    public int TotalUsers { get; set; }
    public int ActiveUsers { get; set; }
    public int NewUsersThisMonth { get; set; }
    public List<UserActivityData> UserActivityChart { get; set; } = new();
    public List<RoleDistribution> RoleDistribution { get; set; } = new();
}

public class UserActivityData
{
    public string Date { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class RoleDistribution
{
    public string Role { get; set; } = string.Empty;
    public int Count { get; set; }
}
