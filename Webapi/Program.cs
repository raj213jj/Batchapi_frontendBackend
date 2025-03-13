using BatchWebApi.Context;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Authentication
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container
            builder.Services.AddControllers();

            // Configure database context
            builder.Services.AddDbContext<AppDbContext>(op =>
                op.UseSqlServer(builder.Configuration.GetConnectionString("MyConnection"))
            );

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Define and configure CORS policy
            var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(MyAllowSpecificOrigins, policy =>
                {
                    // Allow specific origin for your React app
                    policy.WithOrigins("http://localhost:3000")
                          .AllowAnyMethod()  // Allow all HTTP methods (GET, POST, etc.)
                          .AllowAnyHeader(); // Allow all headers (Authorization, Content-Type, etc.)
                });
            });

            // Configure JWT Authentication
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = builder.Configuration["Jwt:Issuer"],
                        ValidAudience = builder.Configuration["Jwt:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])
                        )
                    };
                });

            var app = builder.Build();

            // Configure the HTTP request pipeline
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            // Apply CORS policy before authentication and authorization middleware
            app.UseCors(MyAllowSpecificOrigins);

            // Enable authentication and authorization
            app.UseAuthentication();
            app.UseAuthorization();

            // Map controller routes
            app.MapControllers();

            // Start the application
            app.Run();
        }
    }
}