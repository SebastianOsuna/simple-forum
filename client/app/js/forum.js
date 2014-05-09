(function() {
    var SERVER_URL = "http://localhost:3000/";
    var User = { token: '', name: '', id: '' };
    var pagination = {
        limit: 10,
        offset: 0
    };

    // Load user data
    User = {};
    User.token = localStorage.token;
    User.name = localStorage.name;
    User.id = localStorage.id;

    $( "#new-post" ).submit( function( event ) {
        var form = event.target;
        // New post data
        var data = {
            content: $( "#new-post-text" ).val() 
        };
        if( !data.content ) {
            return false;
        }
        // Disable post button
        $( "#new-post-button" ).prop( 'disabled', true );
        $( "#new-post-reponse" ).attr( { class: '' } ).text( '' );
        // Send request
        $.ajax( {
            url: SERVER_URL + form.getAttribute( 'action' ),
            type: "POST",
            data: data,
            beforeSend: function( xhr ) { xhr.setRequestHeader( 'X-Access-Token', User.token ); }
        } ).done( function( data ) {
            // Reset post data
            $( "#new-post-text" ).val( '' );
            $( "#new-post-reponse" ).attr( { class: 'new-post-success' } ).text( I18N.resolve( 'post.success' ) );
            addPost( data, 0 );
            // Update pagination
            pagination.offset++;
        } ).fail( function( err ) {
            if( err.status == 401 ) {
                // Wrong password
                $( "#new-post-reponse" ).attr( { class: 'new-post-error' } ).text( I18N.resolve( 'post.forbidden' ) );
                logout();
            } else {
                // Unknown error
                $( "#new-post-reponse" ).attr( { class: 'new-post-error' } ).text( I18N.resolve( 'post.unknownError' ) );
            }
        } ).always( function() {
            // Enable send button
            $( "#new-post-button" ).prop( 'disabled', false );
        } );
        return false;
    } );

    // Get more posts
    $( "#more-posts" ).click( function() {
        getPosts( pagination.limit, pagination.offset );
    } );

    // Logout function
    var logout = function() {
        // Clean local storage
        localStorage.removeItem( 'token' );
        localStorage.removeItem( 'name' );
        localStorage.removeItem( 'id' );
        // App root route
        var url = window.location.protocol + "//" + window.location.host + window.location.pathname.substring( 0, window.location.pathname.indexOf( '/', 1 ) );
        // Redirect
        window.location.href = url;
    };

    // Check token validity
    var checkToken = function() {
        $.ajax( {
            url: SERVER_URL + "sessions/",
            type: "GET",
            beforeSend: function( xhr ) { xhr.setRequestHeader( 'X-Access-Token', User.token ); }
        } ).done( loadForum ).fail( logout ); 
        // If valid, load forum. If not, logout.
    };

    var loadForum = function() {
        getPosts();
    };

    var getPosts = function( limit, offset ) {
        // Pagination data
        var query = {
            limit: limit || 10,
            offset: offset || 0
        };

        $.ajax( {
            url: SERVER_URL + "post",
            type: "GET",
            data: query,
            beforeSend: function( xhr ) { xhr.setRequestHeader( 'X-Access-Token', User.token ); }
        } ).done( function( data ) {
            // Update pagination
            pagination.offset = data.pagination.last;
            // Add posts
            addPost( data.posts );
        } ).fail( function( err ) {
            if( err.status == 401 ) {
                // Forbidden
                $( "#new-post-reponse" ).attr( { class: 'new-post-error' } ).text( I18N.resolve( 'post.forbidden' ) );
            } else {
                // Unknown error
                $( "#new-post-reponse" ).attr( { class: 'new-post-error' } ).text( I18N.resolve( 'post.unknownError' ) );
            }
        } );
    };

    var addPost = function ( posts, prepend ) {
        if( posts instanceof Array ) {
            // Handle an array of posts
            posts.forEach( function( o, i ) { addPost( o ); } );
        } else {
            // Handle a single post
            var date = new Date( posts.created_at ).toUTCString();
            // Create DOM Object
            var li = $( "<li>" ).attr( { class: "post" } ).append(
                $( "<div>" ).attr( { class: "name" } ).text( posts.author_name )
            ).append(
                $( "<div>" ).attr( { class: "message" } ).text( posts.content )
            ).append(
                $( "<div>" ).attr( { class: "date" } ).text( date )
            );
            // Append or prepend
            if( prepend === undefined ) {
                $( "#forum-thread" ).append( li );
            } else {
                $( "#forum-thread" ).prepend( li );
            }
        }
    }

    // Verify credentials
    if( User.token && User.name && User.id ) {
        checkToken();
        $( "#user-name" ).text( User.name );
    } else {
        logout();
    }

} )();