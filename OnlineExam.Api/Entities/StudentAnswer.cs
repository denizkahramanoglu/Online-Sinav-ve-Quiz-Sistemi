using System.ComponentModel.DataAnnotations;

namespace OnlineExam.Api.Entities;

public class StudentAnswer
{
    public int Id { get; set; }

    public int SubmissionId { get; set; }
    public ExamSubmission Submission { get; set; } = null!;

    public int QuestionId { get; set; }
    public Question Question { get; set; } = null!;

    [Required, RegularExpression("^[ABCD]$")]
    public string SelectedOption { get; set; } = string.Empty;

    public bool IsCorrect { get; set; }
}
