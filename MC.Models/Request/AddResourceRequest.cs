using MC.Models.Attributes;
using MC.Models.Base;

namespace MC.Models.Request
{
    [TsClass]
    public class AddResourceRequest : BaseRequest
    {
        public required string Key { get; set; }
        public required string Value { get; set; }
        public required string Language { get; set; }
    }
}
