using MC.Models.Attributes;
using MC.Models.Base;
using MC.Models.Entities;

namespace MC.Models.Response
{
    [TsClass]
    public class GetStateResponse : BaseResponse
    {
        public State? State { get; set; }
    }
}
