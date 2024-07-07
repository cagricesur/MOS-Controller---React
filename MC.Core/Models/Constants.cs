namespace MC.Core.Models
{
    public class Constants
    {
        public struct ErrorCodes
        {
            public static readonly string UserExists = "UserExists";
            public static readonly string UserDoesNotExist = "UserDoesNotExist";
            public static readonly string InvalidUserNameOrPassword = "InvalidUserNameOrPassword";
            public static readonly string InvalidTokenError = "InvalidTokenError";
            public static readonly string InvalidStateCodeRange = "InvalidStateCodeRange";
            public static readonly string StateIDMismatch = "StateIDMismatch";
            public static readonly string StateDoesNotExist = "StateDoesNotExist";
        }
        public struct AppConstants
        {
            public static readonly string DefaultMemberPassword = "12345";
        }
        public struct ConfigKeys
        {
            public static readonly string DefaultMemberPassword = "DefaultMemberPassword";
        }
    }
}
