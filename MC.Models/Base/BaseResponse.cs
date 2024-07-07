using MC.Models.Attributes;
using MC.Models.Entities;

namespace MC.Models.Base
{
    [TsClass]
    public class BaseResponse
    {
        public Error? Error { get; set; }
        public bool IsSuccess
        {
            get
            {
                return Error == null;
            }
        }
    }
}
