(function() {
    var SERVER_URL = "http://localhost:3000/";
    var User = { token: '', name: '', id: '' };

    // Load user data
    User = {};
    User.token = localStorage.token;
    User.name = localStorage.name;
    User.id = localStorage.id;
    console.log(User);

    // Logout function
    var logout = function() {
        // Clean local storage
        //localStorage.removeItem( 'token' );
        //localStorage.removeItem( 'name' );
        //localStorage.removeItem( 'id' );
        // App root route
        var url = window.location.protocol + "//" + window.location.host + window.location.pathname.substring( 0, window.location.pathname.indexOf( '/', 1 ) );
        // Redirect
        //window.location.href = url;
    };

    // Check token validity
    var checkToken = function() {
        console.log( 'checkToken' )
        $.ajax( {
            url: SERVER_URL + "sessions/",
            type: "GET",
            data: { token: User.token },
            beforeSend: function( xhr ) { xhr.setRequestHeader( 'X-Access-Token', User.token ); }
        } ).done( loadForum ).fail( logout ); 
        // If valid, load forum. If not, logout.
    };

    var loadForum = function() {

    };

    // Verify credentials
    if( User.token && User.name && User.id ) {
        checkToken();
        $( "#content" ).text( User.name );
    } else {
        logout();
    }

} )();