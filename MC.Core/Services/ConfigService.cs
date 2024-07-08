using MC.Core.Caching;
using MC.Data.Entities;
using MC.Models.Request;
using MC.Models.Response;
using Microsoft.EntityFrameworkCore;

namespace MC.Core.Services
{
    public interface IConfigService
    {
        public Task<GetConfigsResponse> GetConfigs();
        public Task<string?> GetConfig(string key);
        public Task<string> GetConfig(string key, string defaultValue);
        public Task<UpdateConfigsResponse> Update(UpdateConfigsRequest request);
        public void ClearCache();
    }
    public class ConfigService(CCSQLContext context, ICacheProvider cacheProvider) : IConfigService
    {
        private static readonly string CacheKey = "Configs";

        public async Task<UpdateConfigsResponse> Update(UpdateConfigsRequest request)
        {
            var config = await context.Config.SingleOrDefaultAsync(entity => entity.Key == request.Config.Key);
            if (config != null)
            {

                config.Value = request.Config.Value;
                await context.SaveChangesAsync();
            }
            return new UpdateConfigsResponse();
        }
        public async Task<GetConfigsResponse> GetConfigs()
        {
            return await cacheProvider.GetOrCreate(CacheKey, () =>
            {
                var response = new GetConfigsResponse()
                {
                    Configs = context.Config
                        .Select(entity => new MC.Models.Entities.Config()
                        {
                            Key = entity.Key,
                            Value = entity.Value,
                            Description = entity.Description
                        })
                        .ToList()
                        .DistinctBy(entity => entity.Key)
                        .ToList()
                };
                return Task.FromResult(response);
            });
        }

        public async Task<string?> GetConfig(string key)
        {
            var cache = await GetConfigs();
            var config = cache.Configs.SingleOrDefault(entity => entity.Key == key);
            return config?.Value;
        }
        public async Task<string> GetConfig(string key, string defaultValue)
        {
            var value = await GetConfig(key);
            return value ?? defaultValue;
        }

        public void ClearCache()
        {
            cacheProvider.RemoveCache(CacheKey);
        }
    }
}
