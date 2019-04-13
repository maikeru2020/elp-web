function getContent(number) {
    $.get("getLessonPlan", {week: number}, ()=>{
        console.log("getting content here");
    });
}