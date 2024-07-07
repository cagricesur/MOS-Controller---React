using MC.Models.Attributes;
using MC.Models.Base;

namespace MC.Models.Response
{
    [TsClass]
    public class GetResourcesResponse : BaseResponse
    {
        public required Dictionary<string, string > Resources { get; set; }
    }
}
