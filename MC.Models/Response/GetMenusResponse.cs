using MC.Models.Attributes;
using MC.Models.Base;
using MC.Models.Entities;

namespace MC.Models.Response
{
    [TsClass]
    public class GetMenusResponse : BaseResponse
    {
        public required List<Menu> Menus { get; set; }
    }
}
