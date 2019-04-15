function insertPlan() {
    var week = $('#week').val();
    var dueDate = $('#dueDate').val();
    var weekEnding = $('#weekEnding').val();
    var subjectId = $('#subjectId').val();
    var reference = $('#reference').val();
    var dayDuration = $('#dayDuration').val();
    var topic = $('#topic').val();
    var objectives = $('#objectives').val();
    var activities = $('#activities').val();
    var materials = $('#materials').val();
    var corePoints = $('#corePoints').val();
    var evaluation = $('#evaluation').val();

    var params = {
        week: week,
        dueDate: dueDate,
        weekEnding: weekEnding,
        subjectId: subjectId,
        reference: reference,
        dayDuration: dayDuration,
        topic: topic,
        objectives: objectives,
        activities: activities,
        materials: materials,
        corePoints: corePoints,
        evaluation: evaluation
    }

    $.post('insertPlan', params, function(result) {
        if (result.success) {
            alert('Lesson plan inserted successfully');
        }
    });
}