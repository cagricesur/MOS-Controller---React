using MC.Models.Attributes;
using MC.Models.Base;
using MC.Models.Entities;

namespace MC.Models.Response
{
    [TsClass]
    public class RefreshTokenResponse : BaseResponse
    {
        public string? Token { get; set; }
        public DateTime? TokenExpiration { get; set; }
    }
}
