using System.ComponentModel.DataAnnotations;

namespace OnlineExam.Api.Entities;

public class Exam
{
    public int Id { get; set; }

    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    [Range(1, 300)]
    public int DurationMinutes { get; set; } = 30;

    public bool IsActive { get; set; } = true;

    public int TeacherId { get; set; }
    public User Teacher { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Question> Questions { get; set; } = new List<Question>();
}
