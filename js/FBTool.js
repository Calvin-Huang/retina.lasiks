var FBTool = function(appID) {
    var accessToken = null;
    var userID = null;

    FB.init({
        appId : appID,
        status : true,
        cookie : true,
        xfbml : true,
        oauth : true
    });

    this.getIdentity = function() {
        var identity = null;
        FB.getLoginStatus(function(response) {
            if (response.authResponse) {
                identity = {
                    userID : response.authResponse.userID,
                    accessToken : response.authResponse.accessToken
                }
                getAdditionIdentity(identity);
            } else {
                openMask();
                FB.login(function(response) {
                    if (response.authResponse) {
                        identity = {
                            userID : response.authResponse.userID,
                            accessToken : response.authResponse.accessToken
                        }
                        getAdditionIdentity(identity);
                    } else {
                        closeMask();
                        window.alert('同意FB應用程式授權就可以不用填寫聯絡欄');
                    }
                    closeMask();
                }, {scope : 'email'});
            }
        });
        return identity;
    }

    function getAdditionIdentity(identity) {
        $.ajax({
            url : 'https://graph.facebook.com/' + identity.userID,
            type : 'GET',
            async : false,
            data : {
                access_token : identity.accessToken,
            },
            dataType : 'json',
            success : function(response) {
                $.extend(identity, {
                    'email' : response.email,
                    'name' : response.name
                });
            },
            error : function() {

            }
        });
    }
};
