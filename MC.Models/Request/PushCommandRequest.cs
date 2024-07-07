using MC.Models.Attributes;
using MC.Models.Base;
using MC.Models.Entities;
using System.ComponentModel.DataAnnotations;

namespace MC.Models.Request
{
    [TsClass]
    public class PushCommandRequest : BaseRequest
    {
        [Required]
        public required string Command { get; set; }

        [Required]
        public required Guid StateID { get; set; }
    }
}
