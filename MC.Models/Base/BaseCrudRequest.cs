namespace MC.Models.Base
{
    public class BaseCrudRequest<T> : BaseRequest
    {
        public CrudOperationEnum Operation { get; set; }
        public List<T>? Data { get; set; }
    }
}
