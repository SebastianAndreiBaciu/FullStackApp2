public class Eveniment
{
    public int Id { get; set; }
    public string Nume { get; set; }
    public DateTime Data { get; set; }
    public string Locatie { get; set; }

    // Legătură cu utilizatorul care a creat evenimentul
    public int UserId { get; set; }
}