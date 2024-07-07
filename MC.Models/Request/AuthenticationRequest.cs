using MC.Models.Attributes;
using MC.Models.Base;
using System.ComponentModel.DataAnnotations;

namespace MC.Models.Request
{
    [TsClass]
    public class AuthenticationRequest : BaseRequest
    {
        [Required]
        [MinLength(5)]
        [MaxLength(10)]
        public required string UserName { get; set; }

        [Required]
        [MinLength(8)]
        [MaxLength(10)]
        [RegularExpression("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,10}$")]
        public required string Password { get; set; }
    }
}
