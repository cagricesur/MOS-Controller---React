using MC.Models.Attributes;
using MC.Models.Base;

namespace MC.Models.Request
{
    [TsClass]
    public class GetResourcesRequest : BaseRequest
    {
        public required string Language { get; set; }
    }
}
