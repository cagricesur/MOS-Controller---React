using MC.Models.Attributes;
using MC.Models.Base;
using MC.Models.Entities;

namespace MC.Models.Response
{
    [TsClass]
    public class ListUsersResponse : BaseResponse
    {
        public required List<User> Users { get; set; }
    }
}
