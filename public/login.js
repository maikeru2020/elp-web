function signIn() {
    var username = $('#username').val();
    var password = $('#password').val();
    var query = {username: username, password: password};
    $.post('signIn', query, function(result) {
        if (result.redirect) {
            window.location.replace(result.redirect);
        } else {
            $('#message').text(result.message);
        }
    });
}