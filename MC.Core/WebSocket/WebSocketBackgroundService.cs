using MC.Core.Models;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using System.Net.WebSockets;
using System.Text;

namespace MC.Core
{
    public class WebSocketBackgroundService(IWebSocketManager webSocketManager, IWebSocketMessageManager webSocketMessageManager, IOptions<AppSettings> appSettings) : BackgroundService
    {
        private readonly IWebSocketManager _webSocketManager = webSocketManager;
        private readonly IWebSocketMessageManager _webSocketMessageManager = webSocketMessageManager;

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(1000, stoppingToken);
                await Process(stoppingToken);
            }
        }
       
        private async Task Process(CancellationToken stoppingToken)
        {
            var messageContainers = _webSocketMessageManager.GetMessages();
            foreach (var messageContainer in messageContainers)
            {
                if (messageContainer.Message != null)
                {
                    var socketContainers = _webSocketManager
                        .GetWebSockets()
                        .Where(socketContainer => socketContainer.CreationDate <= messageContainer.CreationDate)
                        .ToList();

                    await Parallel.ForEachAsync(socketContainers, async (socketContainer, cancellationToken) =>
                    {
                        if (socketContainer.WebSocket != null && socketContainer.WebSocket.State == WebSocketState.Open)
                        {
                            _ = socketContainer.WebSocket.SendAsync(Encoding.UTF8.GetBytes(messageContainer.Message), WebSocketMessageType.Text, true, stoppingToken);
                        }
                        await Task.CompletedTask;
                    });
                }
                _webSocketMessageManager.Remove(messageContainer.ID);
                await Task.Delay(appSettings.Value.WebSocketDelaySpan, stoppingToken);
            }
        }
    }
}
