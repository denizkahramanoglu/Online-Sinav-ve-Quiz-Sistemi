using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineExam.Api.Data;
using OnlineExam.Api.DTOs;
using OnlineExam.Api.Entities;

namespace OnlineExam.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ExamsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ExamsController(AppDbContext context)
    {
        _context = context;
    }

    // 1. GET /api/exams?search=...&isActive=true&page=1&pageSize=10
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<PagedResultDto<ExamListItemDto>>> GetExams(
        [FromQuery] string? search,
        [FromQuery] bool? isActive,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 6)
    {
        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 50) pageSize = 6;

        var query = _context.Exams
            .Include(e => e.Teacher)
            .Include(e => e.Questions)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(e => e.Title.ToLower().Contains(term) || e.Description.ToLower().Contains(term));
        }

        if (isActive.HasValue)
        {
            query = query.Where(e => e.IsActive == isActive.Value);
        }

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(e => e.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(e => new ExamListItemDto
            {
                Id = e.Id,
                Title = e.Title,
                Description = e.Description,
                DurationMinutes = e.DurationMinutes,
                IsActive = e.IsActive,
                TeacherName = e.Teacher.FullName,
                QuestionCount = e.Questions.Count,
                CreatedAt = e.CreatedAt
            })
            .ToListAsync();

        return Ok(new PagedResultDto<ExamListItemDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        });
    }

    // 2. GET /api/exams/{id}
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ExamDetailDto>> GetExamById(int id)
    {
        var exam = await _context.Exams
            .Include(e => e.Teacher)
            .Include(e => e.Questions)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (exam == null)
            return NotFound(new { message = "Sınav bulunamadı." });

        var isTeacher = User.IsInRole("Teacher");

        return Ok(new ExamDetailDto
        {
            Id = exam.Id,
            Title = exam.Title,
            Description = exam.Description,
            DurationMinutes = exam.DurationMinutes,
            IsActive = exam.IsActive,
            TeacherName = exam.Teacher.FullName,
            QuestionCount = exam.Questions.Count,
            CreatedAt = exam.CreatedAt,
            Questions = exam.Questions.Select(q => new QuestionDto
            {
                Id = q.Id,
                QuestionText = q.QuestionText,
                OptionA = q.OptionA,
                OptionB = q.OptionB,
                OptionC = q.OptionC,
                OptionD = q.OptionD,
                CorrectOption = isTeacher ? q.CorrectOption : null,
                Points = q.Points
            }).ToList()
        });
    }

    // 3. POST /api/exams (Sadece Öğretmen)
    [HttpPost]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> CreateExam([FromBody] CreateUpdateExamDto dto)
    {
        var teacherId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var exam = new Exam
        {
            Title = dto.Title.Trim(),
            Description = dto.Description.Trim(),
            DurationMinutes = dto.DurationMinutes,
            IsActive = dto.IsActive,
            TeacherId = teacherId
        };

        _context.Exams.Add(exam);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetExamById), new { id = exam.Id }, new { exam.Id, exam.Title });
    }

    // 4. PUT /api/exams/{id} (Sadece Öğretmen)
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> UpdateExam(int id, [FromBody] CreateUpdateExamDto dto)
    {
        var exam = await _context.Exams.FindAsync(id);
        if (exam == null)
            return NotFound(new { message = "Sınav bulunamadı." });

        var teacherId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        if (exam.TeacherId != teacherId)
            return StatusCode(StatusCodes.Status403Forbidden, new { message = "Sadece kendi oluşturduğunuz sınavı düzenleyebilirsiniz." });

        exam.Title = dto.Title.Trim();
        exam.Description = dto.Description.Trim();
        exam.DurationMinutes = dto.DurationMinutes;
        exam.IsActive = dto.IsActive;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Sınav başarıyla güncellendi.", exam.Id });
    }

    // 5. DELETE /api/exams/{id} (Sadece Öğretmen -> 204 No Content)
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> DeleteExam(int id)
    {
        var exam = await _context.Exams.FindAsync(id);
        if (exam == null)
            return NotFound(new { message = "Sınav bulunamadı." });

        var teacherId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        if (exam.TeacherId != teacherId)
            return StatusCode(StatusCodes.Status403Forbidden, new { message = "Sadece kendi oluşturduğunuz sınavı silebilirsiniz." });

        _context.Exams.Remove(exam);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // 6. POST /api/exams/{id}/questions (Sınava Soru Ekleme)
    [HttpPost("{id:int}/questions")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> AddQuestion(int id, [FromBody] CreateQuestionDto dto)
    {
        var exam = await _context.Exams.FindAsync(id);
        if (exam == null)
            return NotFound(new { message = "Sınav bulunamadı." });

        var teacherId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        if (exam.TeacherId != teacherId)
            return StatusCode(StatusCodes.Status403Forbidden, new { message = "Bu sınava soru ekleme yetkiniz yok." });

        var question = new Question
        {
            ExamId = id,
            QuestionText = dto.QuestionText.Trim(),
            OptionA = dto.OptionA.Trim(),
            OptionB = dto.OptionB.Trim(),
            OptionC = dto.OptionC.Trim(),
            OptionD = dto.OptionD.Trim(),
            CorrectOption = dto.CorrectOption,
            Points = dto.Points
        };

        _context.Questions.Add(question);
        await _context.SaveChangesAsync();

        return StatusCode(StatusCodes.Status201Created, new { question.Id, question.QuestionText, question.Points });
    }

    // 7. DELETE /api/exams/{examId}/questions/{questionId}
    [HttpDelete("{examId:int}/questions/{questionId:int}")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> DeleteQuestion(int examId, int questionId)
    {
        var question = await _context.Questions
            .Include(q => q.Exam)
            .FirstOrDefaultAsync(q => q.Id == questionId && q.ExamId == examId);

        if (question == null)
            return NotFound(new { message = "Soru bulunamadı." });

        var teacherId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        if (question.Exam.TeacherId != teacherId)
            return StatusCode(StatusCodes.Status403Forbidden, new { message = "Bu soruyu silme yetkiniz yok." });

        _context.Questions.Remove(question);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
