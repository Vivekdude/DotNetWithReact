using EnterpriseAPI.Models.DTOs;

namespace EnterpriseAPI.Services;

public interface IAuthService
{
    Task<AuthResponse?> LoginAsync(LoginRequest request);
    Task<AuthResponse?> RegisterAsync(RegisterRequest request);
    Task<UserDto?> GetUserByEmailAsync(string email);
}
