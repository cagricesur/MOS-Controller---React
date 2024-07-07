using System.Collections.Concurrent;
using System.Collections.ObjectModel;

namespace MC.Core
{
    public class WebSocketMessageManager : IWebSocketMessageManager
    {
        private readonly ConcurrentDictionary<Guid, WebSocketMessageContainer> messages = new();
        public WebSocketMessageContainer? Add(string? message)
        {
            var container = new WebSocketMessageContainer()
            {
                ID = Guid.NewGuid(),
                Message = message,
                CreationDate = DateTime.UtcNow
            };
            if (messages.TryAdd(container.ID, container))
            {
                return container;
            }
            return null;
        }
        public bool Remove(Guid id)
        {
            return messages.TryRemove(id, out _);
        }
        public ReadOnlyCollection<WebSocketMessageContainer> GetMessages()
        {
            return new ReadOnlyCollection<WebSocketMessageContainer>(messages.Values.ToList());
        }
    }
}
