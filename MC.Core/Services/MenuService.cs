using MC.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MC.Models.Request;
using MC.Models.Response;
using MC.Core.Caching;
using Microsoft.EntityFrameworkCore;
using MC.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace MC.Core.Services
{
    public interface IMenuService
    {
        public Task<GetMenusResponse> GetMenus(GetMenusRequest request);
        public void ClearCache();
    }
    public class MenuService(CCSQLContext context, ICacheProvider cacheProvider) : IMenuService
    {
        private static readonly string CacheKey = "Menu";
        public void ClearCache()
        {
            cacheProvider.RemoveCache(CacheKey);
        }
        private static bool IsInRole(Menu data, UserRoleEnum role)
        {
            var roles = data.Roles
                .Split(',')
                .Where(role =>
                {
                    if (int.TryParse(role, out var roleId))
                    {
                        var roleEnum = (UserRoleEnum)roleId;
                        return roleEnum != UserRoleEnum.Unknown;
                    }
                    return false;
                })
                .Select(role => (UserRoleEnum)int.Parse(role))
                .ToList();

            return roles.Contains(role);
        }
        public async Task<GetMenusResponse> GetMenus(GetMenusRequest request)
        {
            var cacheKey = string.Join("|", CacheKey, request.Role);
            return await cacheProvider.GetOrCreate(cacheKey, async () =>
            {
                var dataList = await context.Menu.ToListAsync();

                var response = new GetMenusResponse()
                {
                    Menus = dataList
                        .Where(entity => IsInRole(entity, request.Role))
                        .Select(entity => new MC.Models.Entities.Menu()
                        {
                            ID = entity.ID,
                            ParentID = entity.ParentID,
                            Caption = entity.Caption,
                            Icon = entity.Icon,
                            Path = entity.Path,
                        })
                        .ToList()
                };

                return response;
            });
        }
    }
}
