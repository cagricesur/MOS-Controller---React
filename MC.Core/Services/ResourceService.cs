using MC.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MC.Models.Request;
using MC.Models.Response;
using MC.Core.Caching;

namespace MC.Core.Services
{
    public interface IResourceService
    {
        public Task<AddResourceResponse> AddResource(AddResourceRequest request);
        public Task<GetResourcesResponse> GetResources(GetResourcesRequest request);
        public void ClearCache();
    }
    public class ResourceService(CCSQLContext context, ICacheProvider cacheProvider) : IResourceService
    {
        private static readonly string CacheKey = "Resources";
        public void ClearCache()
        {
            cacheProvider.RemoveCache(CacheKey);
        }
        private async Task<Dictionary<string, string>> GetResources()
        {
            return await cacheProvider.GetOrCreate(CacheKey, () =>
            {
                var dataList = context.Resource
                    .ToList()
                    .DistinctBy(entity => entity.Key + entity.Language)
                    .ToList();

                var dic = dataList.ToDictionary(entity => $"{entity.Language}|{entity.Key}", entity => entity.Value);

                return Task.FromResult(dic);

            });
        }
        public async Task<GetResourcesResponse> GetResources(GetResourcesRequest request)
        {
            var resources = new Dictionary<string, string>();
            var cache = await GetResources();
            if (cache != null)
            {
                resources = cache
                    .ToList()
                    .Select(kvp =>
                    {
                        var parts = kvp.Key.Split('|');
                        var lang = parts.First();
                        var key = string.Join("", parts.Skip(1));
                        return new Resource()
                        {
                            Key = key,
                            Language = lang,
                            Value = kvp.Value
                        };
                    })
                    .Where(entity => entity.Language == request.Language)
                    .ToDictionary(entity => entity.Key, entity => entity.Value);
            }
            return new GetResourcesResponse() { Resources = resources };
        }

        private static readonly object LockObject = new();
        public Task<AddResourceResponse> AddResource(AddResourceRequest request)
        {
            lock (LockObject)
            {
                var resource = context.Resource.SingleOrDefault(entity => entity.Key == request.Key && entity.Language == request.Language);
                if (resource == null)
                {
                    resource = new Resource()
                    {
                        ID = Guid.NewGuid(),
                        Key = request.Key,
                        Value = request.Value,
                        Language = request.Language,
                    };
                    context.Resource.Add(resource);
                    context.SaveChanges();
                }
                var response = new AddResourceResponse() { Resources = [] };
                response.Resources.Add(resource.Key, resource.Value);
                return Task.FromResult(response);
            }
        }
    }
}
