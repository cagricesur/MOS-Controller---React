using MC.Models.Attributes;

namespace MC.Models
{
    [TsEnum]
    public enum UserStatusEnum
    {
        Unknown,
        Active,
        Passive        
    }
    [TsEnum]
    public enum UserRoleEnum
    {
        Unknown,
        Administrator,
        Member
    }
}
