using MC.Models.Attributes;
using MC.Models.Base;
using MC.Models.Entities;

namespace MC.Models.Request
{
    [TsClass]
    public class UpdateConfigsRequest : BaseRequest
    {
        public required Config Config { get; set; }
    }
}
