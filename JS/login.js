function logIn(){
    var password = $("#password").val();
    var username = $("#username").val();
    services.login(username,password);
}