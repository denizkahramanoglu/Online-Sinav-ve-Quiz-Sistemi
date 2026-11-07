using System.ComponentModel.DataAnnotations;

namespace OnlineExam.Api.Entities;

public class User
{
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required, MaxLength(150), EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [Required, MaxLength(20)]
    public string Role { get; set; } = "Student"; // "Teacher" veya "Student"

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Exam> CreatedExams { get; set; } = new List<Exam>();
}
