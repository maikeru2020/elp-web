function getContent(number) {
    $.get("getLessonPlan", {week: number}, function(result) {
        var week = result.week;
        var dueDate = formatDate(result.due_date);
        var weekEnding = formatDate(result.week_ending);
        var reference = result.reference;
        var dayDuration = result.day_duration;
        var topic = result.topic;
        var objectives = result.objectives;
        var activities = result.activities;
        var materials = result.materials;
        var corePoints = result.core_points;
        var evaluation = result.evaluation;

        var content = "<h1>Week " + week + "</h1>" +
                      "Due Date:<br>" +
                      "<input type='date' value='" + dueDate + "'><br>" +
                      "Week Ending:<br>" +
                      "<input type='date' value='" + weekEnding + "'><br>" +
                      "Reference:<br>" +
                      "<textarea>" + reference + "</textarea><br>" +
                      "Day / Duration:<br>" +
                      "<textarea>" + dayDuration + "</textarea><br>" +
                      "Topic:<br>" +
                      "<textarea>" + topic + "</textarea><br>" +
                      "Objectives / R.P.K.:<br>" +
                      "<textarea>" + objectives + "</textarea><br>" +
                      "Teacher-Learner Activities:<br>" +
                      "<textarea>" + activities + "</textarea><br>" +
                      "Teaching Learning Materials:<br>" +
                      "<textarea>" + materials + "</textarea><br>" +
                      "Core Points:<br>" +
                      "<textarea>" + corePoints + "</textarea><br>" +
                      "Evaluation and Remarks:<br>" +
                      "<textarea>" + evaluation + "</textarea><br>" +
                      "<button>Save</button>";

        $('.content').html(content);
    });
}

function formatDate(date) {
    return date.split('T')[0];
}