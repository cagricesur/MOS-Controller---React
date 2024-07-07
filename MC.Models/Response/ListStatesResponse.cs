using MC.Models.Attributes;
using MC.Models.Base;
using MC.Models.Entities;

namespace MC.Models.Response
{
    [TsClass]
    public class ListStatesResponse : BaseResponse
    {
        public required List<State> States { get; set; }
    }
}
