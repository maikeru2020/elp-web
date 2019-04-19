function getContent(planId) {
    $.get('getPlanById', {planId: planId}, function(result) {
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

        var content = "<h1>Week " + week + "</h1>" +
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
                      "<button onclick='approvePlan("+ planId + ");'>Approve</button>";
        $('.content').html(content);

        var feedback = "Feedback:<br>" +
                       "<textarea id='comment'></textarea><br>" +
                       "<button onclick='sendFeedback(" + planId + ");'>Send Comments</button>";
                    
        $('#feedback').html(feedback);    
    });
}

function formatDate(date) {
    return date.split('T')[0];
}

function approvePlan(planId) {
    $.post('approvePlan', {planId: planId}, function(result) {
        if (result.success) {
            alert('Lesson plan approved');
        }
    });
}

function sendFeedback(planId) {
    var comment = $('#comment').val();
    var params = {
        planId: planId,
        comment: comment
    };
    $.post('insertComment', params, function(result) {
        if (result.success) {
            alert('Your comments have been sent');
        }
    });
}