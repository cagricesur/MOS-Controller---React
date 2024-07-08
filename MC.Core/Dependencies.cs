using MC.Core.Caching;
using MC.Core.Services;
using MC.Data.Entities;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace MC.Core
{
    public static class Dependencies
    {
        public static IServiceCollection AddCCSQLContextSupport(this IServiceCollection services, string? connectionString)
        {
            return services.AddDbContext<CCSQLContext>(options =>
            {
                options.UseSqlServer(connectionString);
            });
        }
        public static IServiceCollection AddMemoCacheSupport(this IServiceCollection services)
        {
            return services
                 .AddMemoryCache()
                 .AddScoped<ICacheProvider, MemoCacheProvider>();
        }
        public static IServiceCollection AddServicesSupport(this IServiceCollection services)
        {
            return services
                .AddMenuServiceSupport()
                .AddUserServiceSupport()
                .AddStateServiceSupport()
                .AddConfigServiceSupport()
                .AddResourceServiceSupport()
                .AddAuthenticationServiceSupport();
        }
        public static IServiceCollection AddWebSocketSupport(this IServiceCollection services)
        {
            return services
                 .AddSingleton<IWebSocketManager, WebSocketManager>()
                 .AddSingleton<IWebSocketMessageManager, WebSocketMessageManager>()
                 .AddHostedService<WebSocketBackgroundService>();
        }
        public static IApplicationBuilder UseWebSocketSupport(this IApplicationBuilder app)
        {
            var webSocketOptions = new WebSocketOptions
            {
                KeepAliveInterval = TimeSpan.FromMinutes(2),
            };
            return app.UseWebSockets(webSocketOptions);
        }

 
        private static IServiceCollection AddAuthenticationServiceSupport(this IServiceCollection services)
        {
            return services.AddTransient<IAuthenticationService, AuthenticationService>();
        }
        private static IServiceCollection AddUserServiceSupport(this IServiceCollection services)
        {
            return services.AddTransient<IUserService, UserService>();
        }
        private static IServiceCollection AddConfigServiceSupport(this IServiceCollection services)
        {
            return services.AddTransient<IConfigService, ConfigService>();
        }
        private static IServiceCollection AddResourceServiceSupport(this IServiceCollection services)
        {
            return services.AddTransient<IResourceService, ResourceService>();
        }
        private static IServiceCollection AddStateServiceSupport(this IServiceCollection services)
        {
            return services.AddTransient<IStateService, StateService>();
        }

        private static IServiceCollection AddMenuServiceSupport(this IServiceCollection services)
        {
            return services.AddTransient<IMenuService, MenuService>();
        }
    }
}
