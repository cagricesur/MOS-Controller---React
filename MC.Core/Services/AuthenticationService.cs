using Azure;
using MC.Core.Helpers;
using MC.Core.Models;
using MC.Data.Entities;
using MC.Models;
using MC.Models.Request;
using MC.Models.Response;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MC.Core.Services
{
    public interface IAuthenticationService
    {
        Task<AuthenticationResponse> Authenticate(AuthenticationRequest request);
        Task<RefreshTokenResponse> RefreshToken(RefreshTokenRequest request);
    }
    public class AuthenticationService(CCSQLContext context, IUserService userService, IOptions<AppSettings> appSettings) : IAuthenticationService
    {
        public async Task<AuthenticationResponse> Authenticate(AuthenticationRequest request)
        {
            var response = new AuthenticationResponse();

            bool authenticated = false;

            var data = await (from user in context.User
                              join status in context.UserStatus
                              on user.ID equals status.UserID
                              join role in context.UserRole
                              on user.ID equals role.UserID
                              join password in context.UserPassword
                              on user.ID equals password.UserID
                              where user.UserName == request.UserName && status.Status == (short)UserStatusEnum.Active
                              select new
                              {
                                  User = user,
                                  status.Status,
                                  password.Password,
                                  role.Role
                              }).SingleOrDefaultAsync();


            if(data != null && PasswordHelper.Verify(data.Password, request.Password, data.User.ID.ToString()))
            {
                authenticated = true;
                response.User = new MC.Models.Entities.User()
                {
                    ID = data.User.ID,
                    FirstName = data.User.FirstName,
                    LastName = data.User.LastName,
                    UserName = data.User.UserName,
                    Status = (UserStatusEnum)data.Status,
                    Role = (UserRoleEnum)data.Role
                };
                response.TokenExpiration = DateTime.UtcNow.Add(appSettings.Value.JwtTokenExpirationSpan);
                response.Token = CreateToken(response.User, response.TokenExpiration.Value);
            }


            if (!authenticated)
            {
                response.CreateError(Constants.ErrorCodes.InvalidUserNameOrPassword);
            }

            return response;
        }
        public async Task<RefreshTokenResponse> RefreshToken(RefreshTokenRequest request)
        {
            var response = new RefreshTokenResponse();

            bool authenticated = false;
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(appSettings.Value.JwtSecret)),
                RoleClaimType = ClaimTypes.Role,
                ClockSkew = TimeSpan.Zero
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(request.Token, tokenValidationParameters, out SecurityToken securityToken);
            if(principal != null)
            {
                var userNameClaim = principal.FindFirst(ClaimTypes.Name);
                var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier);
                var userRoleClaim = principal.FindFirst(ClaimTypes.Role);
                if(userNameClaim != null && userIdClaim != null && userRoleClaim != null && Guid.TryParse(userIdClaim.Value, out Guid userId))
                {
                    var getUserResponse = await userService.Get(new GetUserRequest()
                    {
                         ID = userId
                    });
                    if(getUserResponse.IsSuccess && 
                       getUserResponse.User != null && 
                       getUserResponse.User.UserName == userNameClaim.Value &&
                       getUserResponse.User.UserName == request.UserName &&
                       getUserResponse.User.Role.ToString() == userRoleClaim.Value)
                    {
                        authenticated = true;
                        response.TokenExpiration = DateTime.UtcNow.Add(appSettings.Value.JwtTokenExpirationSpan);
                        response.Token = CreateToken(getUserResponse.User, response.TokenExpiration.Value);
                    }
                }
            }

            if (!authenticated)
            {
                response.CreateError(Constants.ErrorCodes.InvalidTokenError);
            }

            return response;

        }
        private string CreateToken(MC.Models.Entities.User user, DateTime tokenExpiration)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(appSettings.Value.JwtSecret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new(ClaimTypes.Name, user.UserName),
                    new(ClaimTypes.NameIdentifier, user.ID.ToString()),
                    new(ClaimTypes.Role, user.Role.ToString()),
                }),
                Expires = tokenExpiration,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
