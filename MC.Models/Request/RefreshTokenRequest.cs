using MC.Models.Attributes;
using MC.Models.Base;
using System.ComponentModel.DataAnnotations;

namespace MC.Models.Request
{
    [TsClass]
    public class RefreshTokenRequest : BaseRequest
    {
        [Required]
        [MinLength(5)]
        [MaxLength(10)]
        public required string UserName { get; set; }

        [Required]
        public required string Token { get; set; }
    }
}
