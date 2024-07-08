namespace MC.Core.Models
{
    public class AppSettings
    {
        public required string JwtSecret { get; set; }
        public required int JwtTokenExpiration { get; set; } = 60;
        public int SlidingCacheExpiration { get; set; } = 60;

        public int WebSocketDelay { get; set; } = 100;
        public TimeSpan SlidingCacheExpirationSpan
        {
            get
            {
                return TimeSpan.FromMinutes(SlidingCacheExpiration);
            }
        }
        public TimeSpan JwtTokenExpirationSpan
        {
            get
            {
                return TimeSpan.FromMinutes(JwtTokenExpiration);
            }
        }
        public TimeSpan WebSocketDelaySpan
        {
            get
            {
                return TimeSpan.FromMilliseconds(WebSocketDelay);
            }
        }
    }
}
