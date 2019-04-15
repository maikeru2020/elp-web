function createAccount() {
    var firstName = $('#firstName').val();
    var lastName = $('#lastName').val();
    var username = $('#username').val();
    var phone = $('#phone').val();
    var password = $('#password').val();
    var email = $('#email').val();
    var accountType = $('#selectTitle').val();

    var query = {
        firstName: firstName, 
        lastName: lastName,
        username: username,
        phone: phone,
        password: password,
        email: email,
        accountType: accountType 
    };

    $.post('createAccount', query, function(result) {
        if (result.success) {
            var message = username + " inserted into database";
            alert(message);
        }
    });
}