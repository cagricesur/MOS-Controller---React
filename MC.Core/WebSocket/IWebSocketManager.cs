using System.Collections.ObjectModel;
using System.Net.WebSockets;

namespace MC.Core
{
    public interface IWebSocketManager
    {
        bool Remove(Guid id);
        WebSocketContainer? Add(WebSocket socket);
        ReadOnlyCollection<WebSocketContainer> GetWebSockets();
    }
}
