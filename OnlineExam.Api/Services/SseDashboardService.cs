using System.Collections.Concurrent;
using System.Text.Json;

namespace OnlineExam.Api.Services;

public class DashboardMetricsDto
{
    public int TotalExams { get; set; }
    public int TotalStudents { get; set; }
    public int TotalSubmissions { get; set; }
    public double AverageScore { get; set; }
    public List<RecentSubmissionDto> RecentSubmissions { get; set; } = new();
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}

public class RecentSubmissionDto
{
    public int SubmissionId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string ExamTitle { get; set; } = string.Empty;
    public int Score { get; set; }
    public DateTime CompletedAt { get; set; }
}

public class SseDashboardService
{
    private readonly ConcurrentDictionary<Guid, StreamWriter> _clients = new();

    public Guid RegisterClient(Stream responseStream)
    {
        var clientId = Guid.NewGuid();
        var writer = new StreamWriter(responseStream);
        _clients.TryAdd(clientId, writer);
        return clientId;
    }

    public void UnregisterClient(Guid clientId)
    {
        _clients.TryRemove(clientId, out _);
    }

    public async Task BroadcastMetricsAsync(DashboardMetricsDto metrics)
    {
        var json = JsonSerializer.Serialize(metrics, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        var payload = $"data: {json}\n\n";

        foreach (var (clientId, writer) in _clients)
        {
            try
            {
                await writer.WriteAsync(payload);
                await writer.FlushAsync();
            }
            catch
            {
                UnregisterClient(clientId);
            }
        }
    }
}
