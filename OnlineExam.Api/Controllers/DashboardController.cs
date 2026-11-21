using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineExam.Api.Data;
using OnlineExam.Api.Services;

namespace OnlineExam.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly SseDashboardService _sseService;

    public DashboardController(AppDbContext context, SseDashboardService sseService)
    {
        _context = context;
        _sseService = sseService;
    }

    // 10. GET /api/dashboard/metrics (İlk açılış anlık metrikleri - Sadece Öğretmen)
    [HttpGet("metrics")]
    [Authorize(Roles = "Teacher")]
    public async Task<ActionResult<DashboardMetricsDto>> GetInitialMetrics()
    {
        return Ok(await GetCurrentMetricsAsync());
    }

    // 11. GET /api/dashboard/stream (Server-Sent Events Canlı Akış Uç Noktası)
    [HttpGet("stream")]
    public async Task StreamDashboard(CancellationToken cancellationToken)
    {
        Response.Headers.Append("Content-Type", "text/event-stream");
        Response.Headers.Append("Cache-Control", "no-cache");
        Response.Headers.Append("Connection", "keep-alive");

        var clientId = _sseService.RegisterClient(Response.Body);

        try
        {
            // Bağlantı kurulur kurulmaz ilk veriyi hemen gönder
            var initialMetrics = await GetCurrentMetricsAsync();
            var json = JsonSerializer.Serialize(initialMetrics, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });
            await Response.WriteAsync($"data: {json}\n\n", cancellationToken);
            await Response.Body.FlushAsync(cancellationToken);

            // İstemci sayfayı kapatana kadar bağlantıyı açık tut
            while (!cancellationToken.IsCancellationRequested)
            {
                await Task.Delay(15000, cancellationToken);
                await Response.WriteAsync(": keep-alive\n\n", cancellationToken);
                await Response.Body.FlushAsync(cancellationToken);
            }
        }
        catch (OperationCanceledException)
        {
            // İstemci bağlantıyı kapattı
        }
        finally
        {
            _sseService.UnregisterClient(clientId);
        }
    }

    private async Task<DashboardMetricsDto> GetCurrentMetricsAsync()
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
