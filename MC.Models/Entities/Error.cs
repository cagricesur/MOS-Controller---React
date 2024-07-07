using MC.Models.Attributes;

namespace MC.Models.Entities
{
    [TsClass]
    public class Error
    {
        public required string Code { get; set; }
    }
}
