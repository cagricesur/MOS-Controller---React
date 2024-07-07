using MC.Models.Attributes;
using MC.Models.Base;
using MC.Models.Entities;
using System.ComponentModel.DataAnnotations;

namespace MC.Models.Request
{
    [TsClass]
    public class UpdateStateRequest : BaseRequest
    {
        [Required]
        public Guid ID { get; set; }

        [Required]
        public required State State { get; set; }
    }
}
