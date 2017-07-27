var URL = "https://api.instagram.com/oauth/authorize/?client_id=CLIENT-ID&redirect_uri=REDIRECT-URI&response_type=code"
var redirectURL = "http://your-redirect-uri?error=access_denied&error_reason=user_denied&error_description=The+user+denied+your+request"

function getURL(){
    return $.get(URL)
}

//Treat your Instagram access token like you would your password. Do not share your access token with anyone.

