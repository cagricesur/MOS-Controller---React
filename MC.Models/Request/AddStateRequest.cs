using MC.Models.Attributes;
using MC.Models.Base;
using MC.Models.Entities;
using System.ComponentModel.DataAnnotations;

namespace MC.Models.Request
{
    [TsClass]
    public class AddStateRequest : BaseRequest
    {
        [Required]
        public required State State { get; set; }
    }
}
