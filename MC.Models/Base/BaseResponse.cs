using MC.Models.Entities;

namespace MC.Models.Base
{
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
