using MC.Core;
using MC.Core.Models;
using MC.Core.Services;
using MC.Models.Request;
using MC.Models.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MC.Web.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class StateController(IStateService stateService, IConfigService configService, IWebSocketMessageManager webSocketMessageManager) : ControllerBase
    {

        [HttpPost]
        [Authorize(Roles = "Administrator,Member")]
        public Task<ListStatesResponse> List(ListStatesRequest request)
        {
            return stateService.List(request);
        }

        [HttpPost]
        [Authorize(Roles = "Administrator,Member")]
        public Task<GetStateResponse> Get(GetStateRequest request) 
        {
            return stateService.Get(request);
        }

        [HttpPost]
        [Authorize(Roles = "Administrator")]
        public Task<AddStateResponse> Add(AddStateRequest request)
        {
            return stateService.Add(request);
        }

        [HttpPost]
        [Authorize(Roles = "Administrator")]
        public Task<UpdateStateResponse> Update(UpdateStateRequest request)
        {
            return stateService.Update(request);
        }

        [HttpPost]
        [Authorize(Roles = "Administrator")]
        public Task<DeleteStateResponse> Delete(DeleteStateRequest request)
        {
            return stateService.Delete(request);
        }

        [HttpPost]
        [Authorize(Roles = "Administrator,Member")]
        public async Task<PushCommandResponse> PushCommand(PushCommandRequest request)
        {
            var response = new PushCommandResponse();

            bool isVerified = await stateService.Verify(request.StateID);

            if (isVerified)
            {

                var arr = request.Command.Split('|');
                var prefix = await configService.GetConfig("SystemPrefix");
                var suffix = await configService.GetConfig("SystemSuffix");
                if (prefix != null)
                {
                    arr = arr.Select(code => string.Join("-", prefix, code)).ToArray();
                }
                if (suffix != null)
                {
                    arr = arr.Select(code => string.Join("-", code, suffix)).ToArray();
                }
                foreach (var code in arr)
                {
                    webSocketMessageManager.Add(code);
                }
            }
            else
            {
                response.CreateError(Constants.ErrorCodes.StateDoesNotExist);
            }
            return response;
        }
    }
}
