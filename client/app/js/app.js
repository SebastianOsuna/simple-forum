( function() {
    var SERVER_URL = "http://localhost:3000/";
    var User = { token: '', name: '', id: '' };

    // Override form submit and replace with AJAX
    $( '#login' ).submit( function( event ) {
        var form = event.target;
        // Do the request
        $.ajax( {
            url: SERVER_URL + form.getAttribute( 'action' ),
            type: form.method,
            data: $( form ).serialize()
        } ).done( function( data ) {
            // Set current user data
            User.token = data.token;
            User.name = data.name;
            User.id = data.id;
            console.log( User );
            // Load forum after successful login
            showModal();
            // Save user data to local storage
            localStorage.setItem( 'token', User.token );
            localStorage.setItem( 'name', User.name );
            localStorage.setItem( 'id', User.id );
            
            var url = window.location.protocol + "//" + window.location.host + window.location.pathname + "forum.html";
            window.location.href = url;
        } ).fail( function( err, errName ) {
            if( err.status == 401 ) {
                // Wrong password
                $( "#login-error" ).text( I18N.resolve( 'login.wrongPassword' ) );
            } else {
                // Unknown error
                $( "#login-error" ).text( I18N.resolve( 'login.unknownError' ) );
            }
        } );
        return false;
    } );

    var showModal = function() {
        $( 'body' ).append( 
            $( "<div>" ).attr( { class: 'modal-screen' } ).append(
                $( "<span>" ).attr( { class: 'modal-screen-message' } ).text( I18N.resolve( 'loading' ) )
            )
        );
    };
} )();