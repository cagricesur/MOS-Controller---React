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
    public interface IUserService
    {
        Task<AddUserResponse> Add(AddUserRequest request);
        Task<UpdateUserResponse> Update(UpdateUserRequest request);
        Task<GetUserResponse> Get(GetUserRequest request);
        Task<ListUsersResponse> List(ListUsersRequest request);
    }
    public class UserService(CCSQLContext context, IConfigService configService, IOptions<AppSettings> appSettings) : IUserService
    {
        public async Task<AddUserResponse> Add(AddUserRequest request)
        {
            var response = new AddUserResponse();
            var user = await context.User.SingleOrDefaultAsync(entity => entity.UserName == request.UserName);
            if (user != null)
            {
                response.CreateError(Constants.ErrorCodes.UserExists);
            }
            else
            {
                var userId = Guid.NewGuid();
                context.User.Add(new User()
                {
                    ID = userId,
                    UserName = request.UserName,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    RegistrationDate = DateTime.UtcNow,
                });

                await context.SaveChangesAsync();

                bool isRegistration = !(string.IsNullOrEmpty(request.Password) || string.IsNullOrWhiteSpace(request.Password));

                context.UserRole.Add(new UserRole()
                {
                    ID = Guid.NewGuid(),
                    UserID = userId,
                    Role = (short)UserRoleEnum.Member
                });

                context.UserStatus.Add(new UserStatus()
                {
                    ID = Guid.NewGuid(),
                    UserID = userId,
                    Status = (short)(UserStatusEnum.Active)
                });

                var password = isRegistration ? request.Password! : await configService.GetConfig(Constants.ConfigKeys.DefaultMemberPassword, Constants.AppConstants.DefaultMemberPassword);

                context.UserPassword.Add(new UserPassword()
                {
                    ID = Guid.NewGuid(),
                    UserID = userId,
                    Password = PasswordHelper.Hash(password, userId.ToString())
                }); ;

                await context.SaveChangesAsync();
            }

            return response;
        }
        public async Task<UpdateUserResponse> Update(UpdateUserRequest request)
        {
            var response = new UpdateUserResponse();
            var user = await context.User.SingleOrDefaultAsync(entity => entity.ID == request.ID);
            if (user == null)
            {
                response.CreateError(Constants.ErrorCodes.UserDoesNotExist);
            }
            else
            {
                var status = await context.UserStatus.SingleAsync(entity => entity.UserID == request.ID);
                status.Status = (short)request.Status;
                await context.SaveChangesAsync();
            }
            return response;
        }
        public async Task<GetUserResponse> Get(GetUserRequest request)
        {
            var response = new GetUserResponse();
            var data = await (from user in context.User
                              join status in context.UserStatus
                              on user.ID equals status.UserID
                              join role in context.UserRole
                              on user.ID equals role.UserID
                              where user.ID == request.ID
                              select new
                              {
                                  User = user,
                                  status.Status,
                                  role.Role
                              }).SingleOrDefaultAsync();
            if (data != null)
            {
                response.User = new MC.Models.Entities.User()
                {
                    ID = data.User.ID,
                    FirstName = data.User.FirstName,
                    LastName = data.User.LastName,
                    UserName = data.User.UserName,
                    Status = (UserStatusEnum)data.Status,
                    Role = (UserRoleEnum)data.Role
                };
            }

            return response;
        }
        public async Task<ListUsersResponse> List(ListUsersRequest request)
        {
            var response = new ListUsersResponse()
            {
                Users = []
            };

            var data = await (from user in context.User
                              join status in context.UserStatus
                              on user.ID equals status.UserID
                              join role in context.UserRole
                              on user.ID equals role.UserID
                              where role.Role == (short)UserRoleEnum.Member
                              select new
                              {
                                  User = user,
                                  status.Status,
                                  role.Role
                              }).ToListAsync();

            var users = data.Select(entity => new MC.Models.Entities.User()
            {
                ID = entity.User.ID,
                FirstName = entity.User.FirstName,
                LastName = entity.User.LastName,
                UserName = entity.User.UserName,
                Status = (UserStatusEnum)entity.Status,
                Role = (UserRoleEnum)entity.Role
            });

            response.Users.AddRange(users);

            return response;
        }
    }
}
