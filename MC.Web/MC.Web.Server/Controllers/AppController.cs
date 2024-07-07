using MC.Core.Caching;
using MC.Core.Services;
using MC.Models;
using MC.Models.Request;
using MC.Models.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;

namespace MC.Web.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class AppController(ICacheProvider cacheProvider, IConfigService configService, IResourceService resourceService, IMenuService menuService, IWebHostEnvironment environment) : ControllerBase
    {
        [HttpGet]
        [Authorize(Roles = "Administrator")]
        public IActionResult ClearCache()
        {
            cacheProvider.ClearCache();
            return Ok();
        }
        [HttpGet]
        [Authorize(Roles = "Administrator")]
        public IActionResult ClearConfigCache()
        {
            configService.ClearCache();
            return Ok();
        }
        [HttpGet]
        [Authorize(Roles = "Administrator")]
        public IActionResult ClearResourceCache()
        {
            resourceService.ClearCache();
            return Ok();
        }
        [HttpGet]
        [Authorize(Roles = "Administrator")]
        public IActionResult ClearMenuCache()
        {
            menuService.ClearCache();
            return Ok();
        }

        [HttpGet]
        [Authorize(Roles = "Administrator,Member")]
        public Task<GetMenusResponse> GetMenus()
        {
            var roles = Enum.GetValues<UserRoleEnum>();
            foreach (var role in roles)
            {
                if (User.IsInRole(role.ToString()))
                {
                    return menuService.GetMenus(new GetMenusRequest()
                    {
                        Role = role
                    });
                }
            }

            return Task.FromResult(new GetMenusResponse() { Menus = [] });
        }

        [HttpGet]
        [Authorize(Roles = "Administrator")]
        public async Task<GetConfigsResponse> GetConfigs()
        {
            var configs = await configService.GetConfigs();
            return new GetConfigsResponse
            {
                Configs = configs.Select(kvp => new Models.Entities.Config()
                {
                    Key = kvp.Key,
                    Value = kvp.Value
                }).ToList()
            };
        }

        [HttpPost]
        [Authorize(Roles = "Administrator")]
        public async Task<UpdateConfigsResponse> UpdateConfigs(UpdateConfigsRequest request)
        {
            var response = await configService.Update(request);
            if (response.IsSuccess)
            {
                configService.ClearCache();
            }
            return response;
        }

        [HttpPost]
        public Task<GetResourcesResponse> GetResources(GetResourcesRequest request)
        {
            return resourceService.GetResources(request);
        }

        [HttpPost]
        public Task<AddResourceResponse> AddResource(AddResourceRequest request)
        {
            if (environment.IsDevelopment())
            {
                return resourceService.AddResource(request);
            }
            else
            {
                var response = new AddResourceResponse() { Resources = [] };
                return Task.FromResult(response);
            }
        }
    }
}
