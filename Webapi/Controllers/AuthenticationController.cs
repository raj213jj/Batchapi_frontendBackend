using BatchWebApi.Context;
using BatchWebApi.Models;
using BatchWebApi.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BatchWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthenticationController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // ✅ POST: api/Authentication/login
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginViewModel user)
        {
            // Ensure user object is valid
            if (user == null || string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.Password))
            {
                return BadRequest("Invalid login request");
            }

            // Authenticate user
            var obj = _context.Users.FirstOrDefault(x => x.Email == user.Email && x.Password == user.Password);

            if (obj == null)
            {
                return Unauthorized("Invalid credentials");
            }

            // Generate JWT token
            var tokenString = GenerateJSONWebToken(obj);
            return Ok(new { token = tokenString });
        }

        // ✅ Helper method to get the role name from RoleId
        private string GetRoleName(int roleId)
        {
            return _context.Roles
                .Where(x => x.RoleId == roleId)
                .Select(x => x.RoleName)
                .FirstOrDefault() ?? "User";
        }

        // ✅ JWT Token Generator
        private string GenerateJSONWebToken(User user)
        {
            var role = GetRoleName(user.RoleId);

            // Create claims for the JWT payload
            List<Claim> claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // Unique token ID
                new Claim(JwtRegisteredClaimNames.Sid, user.Id.ToString()), // User ID
                new Claim(JwtRegisteredClaimNames.Name, $"{user.FirstName} {user.LastName}"), // User Full Name
                new Claim(ClaimTypes.Role, role), // User Role
                new Claim("Date", DateTime.Now.ToString()) // Custom Date claim
            };

            // ✅ Add additional roles if required
            var userRoles = _context.Roles.Where(x => x.RoleId == user.RoleId).Select(x => x.RoleName);
            foreach (var userRole in userRoles)
            {
                claims.Add(new Claim(ClaimTypes.Role, userRole));
            }

            // Set up token signing key and credentials
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            // Create the JWT
            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(120), // Token validity
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}