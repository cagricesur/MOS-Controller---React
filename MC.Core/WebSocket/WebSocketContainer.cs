using System.Net.WebSockets;

namespace MC.Core
{
    public class WebSocketContainer
    {
        public Guid ID { get; set; }
        public WebSocket? WebSocket { get; set; }
        public DateTime CreationDate { get; set; }
    }
}
