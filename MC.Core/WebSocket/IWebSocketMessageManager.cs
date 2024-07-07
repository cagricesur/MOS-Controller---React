using System.Collections.ObjectModel;

namespace MC.Core
{
    public interface IWebSocketMessageManager
    {
        bool Remove(Guid id);
        WebSocketMessageContainer? Add(string message);
        ReadOnlyCollection<WebSocketMessageContainer> GetMessages();
    }
}
