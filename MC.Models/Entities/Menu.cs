using MC.Models.Attributes;

namespace MC.Models.Entities
{
    [TsClass]
    public class Menu
    {
        public required string Caption { get; set; }
        public required string Path { get; set; }
        public required string Icon { get; set; }
    }
}
