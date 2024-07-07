using Microsoft.AspNetCore.Identity;
using System.Text.RegularExpressions;

namespace MC.Core.Helpers
{
    internal class PasswordHelper
    {
        public static string Hash(string password, string salt)
        {
            var hasher = new PasswordHasher<string>();
            return hasher.HashPassword(salt, password);
        }
        public static bool Verify(string hash, string password, string salt)
        {
            var hasher = new PasswordHasher<string>();
            return hasher.VerifyHashedPassword(salt, hash, password) != PasswordVerificationResult.Failed;
        }
    }
}
