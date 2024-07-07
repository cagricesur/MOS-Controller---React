
using MC.Models;
using MC.Core;
using System.Text.Json.Serialization;
using Microsoft.OpenApi.Models;
using MC.Core.Models;
using Microsoft.AspNetCore.Identity;
using MC.Data.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.DependencyInjection;
using System.Security.Claims;

namespace MC.Web.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services
                .AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                });

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new() { Title = "MOS Controller API", Version = "v1" });
                options.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme, new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = JwtBearerDefaults.AuthenticationScheme
                });

                options.AddSecurityRequirement(new OpenApiSecurityRequirement()
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Id = JwtBearerDefaults.AuthenticationScheme,
                                Type = ReferenceType.SecurityScheme,

                            },
                            Scheme = "oauth2",
                            Name = JwtBearerDefaults.AuthenticationScheme,
                            In = ParameterLocation.Header,
                        },
                        new List<string>()
                    }
                });
            });

            builder.Services.AddWebSocketSupport();

            var appSettingsSection = builder.Configuration.GetSection("AppSettings");
            var appSettings = appSettingsSection.Get<AppSettings>();

            builder.Services
                .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    if (builder.Environment.IsDevelopment())
                    {
                        options.Events = new JwtBearerEvents()
                        {
                            OnMessageReceived = msg =>
                            {
                                var token = msg?.Request.Headers.Authorization.ToString();
                                string path = msg?.Request.Path ?? "";
                                if (!string.IsNullOrEmpty(token))

                                {
                                    Console.WriteLine("Access token");
                                    Console.WriteLine($"URL: {path}");
                                    Console.WriteLine($"Token: {token}\r\n");
                                }
                                else
                                {
                                    Console.WriteLine("Access token");
                                    Console.WriteLine("URL: " + path);
                                    Console.WriteLine("Token: No access token provided\r\n");
                                }
                                return Task.CompletedTask;
                            },
                            OnTokenValidated = ctx =>
                            {
                                Console.WriteLine();
                                Console.WriteLine("Claims from the access token");
                                if (ctx?.Principal != null)
                                {
                                    foreach (var claim in ctx.Principal.Claims)
                                    {
                                        Console.WriteLine($"{claim.Type} - {claim.Value}");
                                    }
                                }
                                Console.WriteLine();
                                return Task.CompletedTask;
                            }
                        };
                    }
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(appSettings!.JwtSecret)),
                        RoleClaimType = ClaimTypes.Role,
                        ClockSkew = TimeSpan.Zero
                    };
                });



            var connectionString = builder.Configuration.GetConnectionString("CCSQL");

            builder.Services.Configure<AppSettings>(appSettingsSection);
            builder.Services.AddCCSQLContextSupport(connectionString);
            builder.Services.AddServicesSupport();
            builder.Services.AddMemoCacheSupport();

            var app = builder.Build();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseWebSocketSupport();

            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthorization();
            app.MapControllers();
            app.MapFallbackToFile("/index.html");
            app.Run();
        }
    }
}
