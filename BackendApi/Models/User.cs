namespace BackendApi.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        // Store a hashed password, never plain text
        public string PasswordHash { get; set; } = string.Empty;

        // Navigation property for one-to-many relationship with Eveniments
        // Prevent serializing back-reference to avoid JSON cycles (Eveniment -> User -> Eveniments -> ...)
        [System.Text.Json.Serialization.JsonIgnore]
        public ICollection<Eveniment> Eveniments { get; set; } = new List<Eveniment>();
    }
}