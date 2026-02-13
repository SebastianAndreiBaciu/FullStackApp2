namespace BackendApi.Models;

public class Eveniment
{
    public int Id { get; set; }
    public string Nume { get; set; } = string.Empty;
    public DateTime Data { get; set; }
    public string Locatie { get; set; } = string.Empty;

    // Legătură cu utilizatorul care a creat evenimentul
    public int UserId { get; set; }
    // navigation property
    public User? User { get; set; }
}