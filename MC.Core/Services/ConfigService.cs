using MC.Core.Caching;
using MC.Data.Entities;
using MC.Models.Request;
using MC.Models.Response;
using Microsoft.EntityFrameworkCore;

namespace MC.Core.Services
{
    public interface IConfigService
    {
        public Task<Dictionary<string, string>> GetConfigs();
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
            if(config != null) { 
            
                config.Value = request.Config.Value;
                await context.SaveChangesAsync();
            }
            return new UpdateConfigsResponse();
        }
        public async Task<Dictionary<string, string>> GetConfigs()
        {
            return await cacheProvider.GetOrCreate(CacheKey, () =>
            {
                var dataList = context.Config
                .ToList()
                .DistinctBy(entity => entity.Key)
                .ToList();

                var dic = dataList.ToDictionary(entity => entity.Key, entity => entity.Value);
                return Task.FromResult(dic);
            });
        }

        public async Task<string?> GetConfig(string key)
        {
            var cache = await GetConfigs();
            if (cache.TryGetValue(key, out string? value))
            {
                return value;
            }
            else
            {
                return null;
            }
        }
        public async Task<string> GetConfig(string key, string defaultValue)
        {
            var cache = await GetConfigs();
            if (cache.TryGetValue(key, out string? value))
            {
                return value;
            }
            else
            {
                return defaultValue;
            }
        }

        public void ClearCache()
        {
            cacheProvider.RemoveCache(CacheKey);
        }
    }
}
