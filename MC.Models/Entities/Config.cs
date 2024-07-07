using MC.Models.Attributes;

namespace MC.Models.Entities
{
    [TsClass]
    public class Config
    {
        public required string Key { get; set; }
        public required string Value { get; set; }
    }
}
