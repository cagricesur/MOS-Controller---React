using Microsoft.Extensions.Hosting;
using System.Net.WebSockets;
using System.Text;

namespace MC.Core
{
    public class WebSocketBackgroundService(IWebSocketManager webSocketManager, IWebSocketMessageManager webSocketMessageManager) : BackgroundService
    {
        private readonly IWebSocketManager _webSocketManager = webSocketManager;
        private readonly IWebSocketMessageManager _webSocketMessageManager = webSocketMessageManager;

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(1000, stoppingToken); // Replace with actual logic to receive messages
                await Process(stoppingToken);
            }
        }

        private async Task Process(CancellationToken stoppingToken)
        {
            var messageContainers = _webSocketMessageManager.GetMessages();
            await Parallel.ForEachAsync(messageContainers, async (messageContainer, cancellationToken1) =>
            {
                if (messageContainer.Message != null)
                {
                    var socketContainers = _webSocketManager
                        .GetWebSockets()
                        .Where(socketContainer => socketContainer.CreationDate <= messageContainer.CreationDate)
                        .ToList();

                    await Parallel.ForEachAsync(socketContainers, async (socketContainer, cancellationToken2) =>
                    {
                        if (socketContainer.WebSocket != null && socketContainer.WebSocket.State == WebSocketState.Open)
                        {
                            _ = socketContainer.WebSocket.SendAsync(Encoding.UTF8.GetBytes(messageContainer.Message), WebSocketMessageType.Text, true, stoppingToken);
                        }
                        await Task.CompletedTask;
                    });
                }
                _webSocketMessageManager.Remove(messageContainer.ID);
            });

        }
    }
}
