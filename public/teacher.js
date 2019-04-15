function getContent(number) {
    $.get("getLessonPlan", {week: number}, function(result) {
        var content = "Week: " + result.week + "<br>" +
                      "Due Date: " + result.due_date + "<br>" +
                      "Topic: " + result.topic + "<br>";
        $('#content').html(content);
    });
}