using MC.Models.Attributes;

namespace MC.Models.Entities
{
    [TsClass]
    public class Menu
    {
        public required Guid ID { get; set; }
        public Guid? ParentID { get; set; }
        public required string Caption { get; set; }
        public  string? Path { get; set; }
        public required string Icon { get; set; }
    }
}
 