namespace MC.Core
{
    public class WebSocketMessageContainer
    {
        public Guid ID { get; set; }
        public string? Message { get; set; }
        public DateTime CreationDate { get; set; }
    }
}
