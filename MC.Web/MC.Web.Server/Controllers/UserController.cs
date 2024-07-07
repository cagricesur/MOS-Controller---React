using MC.Core.Services;
using MC.Models;
using MC.Models.Request;
using MC.Models.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MC.Web.Server.Controllers
{
    [ApiController]
    [Authorize(Roles = "Administrator")]
    [Route("api/[controller]/[action]")]
    public class UserController(IUserService userService, IAuthenticationService authenticationService) : ControllerBase
    {

        [HttpPost]
        [AllowAnonymous]
        public Task<AuthenticationResponse> Authenticate(AuthenticationRequest request)
        {
            return authenticationService.Authenticate(request);
        }

        [HttpPost]
        [AllowAnonymous]
        public Task<RefreshTokenResponse> RefreshToken(RefreshTokenRequest request)
        {
            return authenticationService.RefreshToken(request);
        }

        [HttpPost]
        [Authorize(Roles = "Administrator")]
        public Task<ListUsersResponse> List(ListUsersRequest request)
        {
            return userService.List(request);
        }

        [HttpPost]
        [Authorize(Roles = "Administrator")]
        public Task<GetUserResponse> Get(GetUserRequest request) 
        {
            return userService.Get(request);
        }

        [HttpPost]
        [AllowAnonymous]
        public Task<AddUserResponse> Add(AddUserRequest request)
        {
            return userService.Add(request);
        }

        [HttpPost]
        [Authorize(Roles = "Administrator")]
        public Task<UpdateUserResponse> Update(UpdateUserRequest request)
        {
            return userService.Update(request);
        }
    }
}
