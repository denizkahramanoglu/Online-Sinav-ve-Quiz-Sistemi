using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineExam.Api.Data;
using OnlineExam.Api.DTOs;
using OnlineExam.Api.Entities;
using OnlineExam.Api.Services;

namespace OnlineExam.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SubmissionsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly SseDashboardService _sseService;

    public SubmissionsController(AppDbContext context, SseDashboardService sseService)
    {
        _context = context;
        _sseService = sseService;
    }

    // 8. POST /api/submissions/exams/{examId} (Öğrenci sınavı tamamlar -> Puan hesaplanır -> SSE tetiklenir)
    [HttpPost("exams/{examId:int}")]
    [Authorize(Roles = "Student")]
    public async Task<ActionResult<SubmissionResultDto>> SubmitExam(int examId, [FromBody] SubmitExamDto dto)
    {
        var exam = await _context.Exams
            .Include(e => e.Questions)
            .FirstOrDefaultAsync(e => e.Id == examId);

        if (exam == null)
            return NotFound(new { message = "Sınav bulunamadı." });

        if (!exam.IsActive)
            return BadRequest(new { message = "Bu sınav şu anda aktif değil." });

        var studentId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var studentName = User.FindFirstValue(ClaimTypes.Name) ?? "Öğrenci";

        var submission = new ExamSubmission
        {
            ExamId = examId,
            StudentId = studentId,
            StartedAt = DateTime.UtcNow.AddMinutes(-5),
            CompletedAt = DateTime.UtcNow
        };

        int totalScore = 0;
        int correctCount = 0;

        foreach (var question in exam.Questions)
        {
            var givenAnswer = dto.Answers.FirstOrDefault(a => a.QuestionId == question.Id);
            var selectedOption = givenAnswer?.SelectedOption ?? "A";
            var isCorrect = selectedOption.Equals(question.CorrectOption, StringComparison.OrdinalIgnoreCase);

            if (isCorrect)
            {
                totalScore += question.Points;
                correctCount++;
            }

            submission.Answers.Add(new StudentAnswer
            {
                QuestionId = question.Id,
                SelectedOption = selectedOption,
                IsCorrect = isCorrect
            });
        }

        submission.TotalScore = totalScore;
        _context.ExamSubmissions.Add(submission);
        await _context.SaveChangesAsync();

        // Canlı Yönetici Panosuna (SSE) güncel istatistikleri fırlat
        var metrics = await BuildDashboardMetricsAsync();
        await _sseService.BroadcastMetricsAsync(metrics);

        return StatusCode(StatusCodes.Status201Created, new SubmissionResultDto
        {
            SubmissionId = submission.Id,
            ExamId = exam.Id,
            ExamTitle = exam.Title,
            StudentName = studentName,
            TotalScore = totalScore,
            MaxPossibleScore = exam.Questions.Sum(q => q.Points),
            CorrectCount = correctCount,
            TotalQuestions = exam.Questions.Count,
            CompletedAt = submission.CompletedAt.Value
        });
    }

    // 9. GET /api/submissions/my (Öğrencinin kendi geçmiş sınav sonuçları)
    [HttpGet("my")]
    public async Task<ActionResult<IEnumerable<SubmissionResultDto>>> GetMySubmissions()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var list = await _context.ExamSubmissions
            .Include(s => s.Exam)
                .ThenInclude(e => e.Questions)
            .Include(s => s.Student)
            .Include(s => s.Answers)
            .Where(s => s.StudentId == userId)
            .OrderByDescending(s => s.CompletedAt)
            .Select(s => new SubmissionResultDto
            {
                SubmissionId = s.Id,
                ExamId = s.ExamId,
                ExamTitle = s.Exam.Title,
                StudentName = s.Student.FullName,
                TotalScore = s.TotalScore,
                MaxPossibleScore = s.Exam.Questions.Sum(q => q.Points),
                CorrectCount = s.Answers.Count(a => a.IsCorrect),
                TotalQuestions = s.Exam.Questions.Count,
                CompletedAt = s.CompletedAt ?? s.StartedAt
            })
            .ToListAsync();

        return Ok(list);
    }

    private async Task<DashboardMetricsDto> BuildDashboardMetricsAsync()
    {
        var totalExams = await _context.Exams.CountAsync();
        var totalStudents = await _context.Users.CountAsync(u => u.Role == "Student");
        var totalSubmissions = await _context.ExamSubmissions.CountAsync();
        var avgScore = totalSubmissions > 0
            ? await _context.ExamSubmissions.AverageAsync(s => (double)s.TotalScore)
            : 0.0;

        var recent = await _context.ExamSubmissions
            .Include(s => s.Student)
            .Include(s => s.Exam)
            .OrderByDescending(s => s.CompletedAt)
            .Take(8)
            .Select(s => new RecentSubmissionDto
            {
                SubmissionId = s.Id,
                StudentName = s.Student.FullName,
                ExamTitle = s.Exam.Title,
                Score = s.TotalScore,
                CompletedAt = s.CompletedAt ?? s.StartedAt
            })
            .ToListAsync();

        return new DashboardMetricsDto
        {
            TotalExams = totalExams,
            TotalStudents = totalStudents,
            TotalSubmissions = totalSubmissions,
            AverageScore = Math.Round(avgScore, 1),
            RecentSubmissions = recent
        };
    }
}
