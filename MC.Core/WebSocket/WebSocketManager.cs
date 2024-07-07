using System.Collections.Concurrent;
using System.Collections.ObjectModel;
using System.Net.WebSockets;

namespace MC.Core
{
    public class WebSocketManager : IWebSocketManager
    {
        private readonly ConcurrentDictionary<Guid, WebSocketContainer> sockets = new();
        public WebSocketContainer? Add(WebSocket? socket)
        {
            var container = new WebSocketContainer()
            {
                ID = Guid.NewGuid(),
                WebSocket = socket,
                CreationDate = DateTime.UtcNow
            };
            if (sockets.TryAdd(container.ID, container))
            {
                return container;
            }
            return null;
        }
        public bool Remove(Guid id)
        {
            return sockets.TryRemove(id, out _);
        }
        public ReadOnlyCollection<WebSocketContainer> GetWebSockets()
        {
            return new ReadOnlyCollection<WebSocketContainer>(sockets.Values.ToList());
        }
    }
}
