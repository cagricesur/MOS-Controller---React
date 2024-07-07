using MC.Models.Base;
using MC.Models.Entities;

public static class Extensions
{
    public static void CreateError(this BaseResponse response, string code)
    {
        response.Error = new Error() { Code = $"Error*{code}" };
    }
}

