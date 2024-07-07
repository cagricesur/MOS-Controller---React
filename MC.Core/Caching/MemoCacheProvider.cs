using MC.Core.Models;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;

namespace MC.Core.Caching
{
    public interface ICacheProvider
    {
        Task<T> GetOrCreate<T>(
            string cacheKey,
            Func<Task<T>> getCacheData);
        void ClearCache();
        void RemoveCache(string cacheKey);
    }
    public class MemoCacheProvider(IMemoryCache cache, IOptions<AppSettings> appSettings) : ICacheProvider
    {
        public void ClearCache()
        {
            if (cache is MemoryCache memoryCache)
            {
                memoryCache.Clear();
            }
        }
        public void RemoveCache(string cacheKey)
        {
            cache.Remove(cacheKey);
        }

        public async Task<T> GetOrCreate<T>(string cacheKey, Func<Task<T>> getCacheData)
        {
            if (!cache.TryGetValue(cacheKey, out T? cachedData) || cachedData == null)
            {
                cachedData = await getCacheData();
                var cacheEntryOptions = new MemoryCacheEntryOptions
                {
                    SlidingExpiration = appSettings.Value.SlidingCacheExpirationSpan
                };
                cache.Set(cacheKey, cachedData, cacheEntryOptions);
            }
            return cachedData;
        }

    }
}
