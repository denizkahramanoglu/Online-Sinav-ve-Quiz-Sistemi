using System.ComponentModel.DataAnnotations;

namespace OnlineExam.Api.DTOs;

public class PagedResultDto<T>
{
    public IEnumerable<T> Items { get; set; } = new List<T>();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
}

public class ExamListItemDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int DurationMinutes { get; set; }
    public bool IsActive { get; set; }
    public string TeacherName { get; set; } = string.Empty;
    public int QuestionCount { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class ExamDetailDto : ExamListItemDto
{
    public List<QuestionDto> Questions { get; set; } = new();
}

public class CreateUpdateExamDto
{
    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    [Range(1, 300)]
    public int DurationMinutes { get; set; } = 30;

    public bool IsActive { get; set; } = true;
}

public class QuestionDto
{
    public int Id { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public string OptionA { get; set; } = string.Empty;
    public string OptionB { get; set; } = string.Empty;
    public string OptionC { get; set; } = string.Empty;
    public string OptionD { get; set; } = string.Empty;
    public string? CorrectOption { get; set; } // Öğrenciye gizlenecek, öğretmene gösterilecek
    public int Points { get; set; }
}

public class CreateQuestionDto
{
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

    [Required, RegularExpression("^[ABCD]$", ErrorMessage = "CorrectOption must be A, B, C, or D.")]
    public string CorrectOption { get; set; } = "A";

    [Range(1, 100)]
    public int Points { get; set; } = 10;
}

public class SubmitExamDto
{
    [Required]
    public List<AnswerInputDto> Answers { get; set; } = new();
}

public class AnswerInputDto
{
    [Required]
    public int QuestionId { get; set; }

    [Required, RegularExpression("^[ABCD]$")]
    public string SelectedOption { get; set; } = string.Empty;
}

public class SubmissionResultDto
{
    public int SubmissionId { get; set; }
    public int ExamId { get; set; }
    public string ExamTitle { get; set; } = string.Empty;
    public string StudentName { get; set; } = string.Empty;
    public int TotalScore { get; set; }
    public int MaxPossibleScore { get; set; }
    public int CorrectCount { get; set; }
    public int TotalQuestions { get; set; }
    public DateTime CompletedAt { get; set; }
}
