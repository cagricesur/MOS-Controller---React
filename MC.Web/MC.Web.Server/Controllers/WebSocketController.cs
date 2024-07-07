using MC.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.WebSockets;

namespace MC.Web.Server.Controllers
{
    [AllowAnonymous]
    [ApiExplorerSettings(IgnoreApi = true)]
    public class WebSocketController(IWebSocketManager webSocketManager) : ControllerBase
    {
        private readonly IWebSocketManager _webSocketManager = webSocketManager;

        [Route("/ws")]
        public async Task Get()
        {
            if (HttpContext.WebSockets.IsWebSocketRequest)
            {
                using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
                if (webSocket != null)
                {
                    var container = _webSocketManager.Add(webSocket);
                    await Echo(container);
                }
            }
            else
            {
                HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
            }
        }

        private async Task Echo(WebSocketContainer? webSocketContainer)
        {
            if (webSocketContainer != null && webSocketContainer.WebSocket != null)
            {
                string? webSocketCloseStatusDescription;
                WebSocketCloseStatus? webSocketCloseStatus;

                do
                {
                    var buffer = new byte[1024 * 4];
                    var receiveResult = await webSocketContainer.WebSocket.ReceiveAsync(
                        new ArraySegment<byte>(buffer), CancellationToken.None);
                    webSocketCloseStatus = receiveResult?.CloseStatus;
                    webSocketCloseStatusDescription = receiveResult?.CloseStatusDescription;

                } while (!webSocketCloseStatus.HasValue);

                _webSocketManager.Remove(webSocketContainer.ID);
                await webSocketContainer.WebSocket.CloseAsync(
                    webSocketCloseStatus ?? WebSocketCloseStatus.EndpointUnavailable,
                    webSocketCloseStatusDescription,
                    CancellationToken.None);
            }
        }
    }
}
