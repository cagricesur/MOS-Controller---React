using MC.Models.Attributes;

namespace MC.Models.Entities
{
    [TsClass]
    public class User
    {
        public Guid ID { get; set; }
        public required string UserName { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public UserStatusEnum Status { get; set; }
        public UserRoleEnum Role { get; set; }
    }
}
