using System.ComponentModel.DataAnnotations;

namespace OnlineExam.Api.Entities;

public class Question
{
    public int Id { get; set; }

    public int ExamId { get; set; }
    public Exam Exam { get; set; } = null!;

    [Required, MaxLength(1000)]
    public string QuestionText { get; set; } = string.Empty;

    [Required, MaxLength(500)]
    public string OptionA { get; set; } = string.Empty;

    [Required, MaxLength(500)]
    public string OptionB { get; set; } = string.Empty;

    [Required, MaxLength(500)]
    public string OptionC { get; set; } = string.Empty;

    [Required, MaxLength(500)]
    public string OptionD { get; set; } = string.Empty;

    [Required, RegularExpression("^[ABCD]$")]
    public string CorrectOption { get; set; } = "A";

    [Range(1, 100)]
    public int Points { get; set; } = 10;
}
