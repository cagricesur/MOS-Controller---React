using MC.Models.Entities;

namespace MC.Models.Base
{
    public class BaseCrudResponse<T> : BaseResponse
        where T : class
    {
        public List<T>? Data { get; set; }
    }
}
