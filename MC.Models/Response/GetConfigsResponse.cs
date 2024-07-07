using MC.Models.Attributes;
using MC.Models.Base;
using MC.Models.Entities;

namespace MC.Models.Response
{
    [TsClass]
    public class GetConfigsResponse : BaseResponse
    {
        public required List<Config> Configs { get; set; }
    }
}
