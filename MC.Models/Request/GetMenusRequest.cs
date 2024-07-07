using MC.Models.Attributes;
using MC.Models.Base;

namespace MC.Models.Request
{
    [TsClass]
    public class GetMenusRequest : BaseRequest
    {
        public required UserRoleEnum Role { get; set; }
    }
}
