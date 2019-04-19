function getContent(week) {
    $.get("getPlan", {week: week}, function(result) {
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
        var planId = result.id;
        if (result.is_approved) {
            var approval = "Approved!";
        } else {
            var approval = "Not Approved";
        }

        var content = "<h1>Week " + week + " (" + approval + ")</h1>" +
                      "Due Date:<br>" +
                      "<input type='date' id='dueDate' value='" + dueDate + "'><br>" +
                      "Week Ending:<br>" +
                      "<input type='date' id='weekEnding' value='" + weekEnding + "'><br>" +
                      "Reference:<br>" +
                      "<textarea id='reference'>" + reference + "</textarea><br>" +
                      "Day / Duration:<br>" +
                      "<textarea id='dayDuration'>" + dayDuration + "</textarea><br>" +
                      "Topic:<br>" +
                      "<textarea id='topic'>" + topic + "</textarea><br>" +
                      "Objectives / R.P.K.:<br>" +
                      "<textarea id='objectives'>" + objectives + "</textarea><br>" +
                      "Teacher-Learner Activities:<br>" +
                      "<textarea id='activities'>" + activities + "</textarea><br>" +
                      "Teaching Learning Materials:<br>" +
                      "<textarea id='materials'>" + materials + "</textarea><br>" +
                      "Core Points:<br>" +
                      "<textarea id='corePoints'>" + corePoints + "</textarea><br>" +
                      "Evaluation and Remarks:<br>" +
                      "<textarea id='evaluation'>" + evaluation + "</textarea><br>" +
                      "<button onclick='savePlan("+ planId + ");'>Save</button>";

        $('.content').html(content);

    });

    $.get('getComments', {week: week}, function(result) {
        var comments = "";
        for (let i = 0; i < result.length; i++) {
            comments += '<div>(' + (i + 1) + ') ' + result[i].comment + '</div>';
        }
        $('#comments').html(comments);
    });

}

function formatDate(date) {
    return date.split('T')[0];
}

function savePlan(planId) {
    var weekEnding = $('#weekEnding').val();
    var reference = $('#reference').val();
    var dayDuration = $('#dayDuration').val();
    var topic =$('#topic').val();
    var objectives = $('#objectives').val();
    var activities = $('#activities').val();
    var materials = $('#materials').val();
    var corePoints = $('#corePoints').val();
    var evaluation = $('#evaluation').val();

    var params = {
        planId: planId,
        weekEnding: weekEnding,
        reference: reference,
        dayDuration: dayDuration,
        topic: topic,
        objectives: objectives,
        activities: activities,
        materials: materials,
        corePoints: corePoints,
        evaluation: evaluation
    }

    $.post('updatePlan', params, function(result) {
        if (result.success) {
            alert('Lesson Notes Saved');
        }
    });
}

function getClassroom() {
    var classroomId = $('#classroomId').val();
    $.get('getClassroom', {classroomId: classroomId}, function(result) {
        var classroom = result.classroom;
        var heading = '<h1>' + classroom.classroom_name + '</h1>';
        $('#heading').html(heading);
        $('.content').html('');
    });
}