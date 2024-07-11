using MC.Core.Models;
using MC.Core.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using System.Net.WebSockets;
using System.Text;

namespace MC.Core
{
    public class WebSocketBackgroundService(IServiceScopeFactory scopeFactory, IWebSocketManager webSocketManager, IWebSocketMessageManager webSocketMessageManager) : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory = scopeFactory;
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

        private async Task<TimeSpan> GetWait()
        {
            using var scope = _scopeFactory.CreateScope();
            var configService = scope.ServiceProvider.GetRequiredService<IConfigService>();
            var wait = await configService.GetConfig("WebSocketWait", "100");
            if (!int.TryParse(wait, out int delay))
            {
                delay = 100;
            }
            return TimeSpan.FromMilliseconds(delay);
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
                var delay = await GetWait();
                await Task.Delay(delay, stoppingToken);
            }
        }
    }
}
