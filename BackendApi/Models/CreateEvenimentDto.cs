namespace BackendApi.Models
{
    public class CreateEvenimentDto
    {
        public string Nume { get; set; } = string.Empty;
        public DateTime Data { get; set; }
        public string Locatie { get; set; } = string.Empty;
    }
}
