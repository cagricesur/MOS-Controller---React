using MC.Models.Attributes;
using MC.Models.Base;
using System.ComponentModel.DataAnnotations;

namespace MC.Models.Request
{
    [TsClass]
    public class UpdateUserRequest : BaseRequest
    {

        [Required]
        public Guid ID { get; set; }

        [Required]
        public UserStatusEnum Status { get; set; }

    }
}
