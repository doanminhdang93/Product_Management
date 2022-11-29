var services = {
    apiUrl : "http://localhost:8081/",
    // chạy câu lệnh bằng cmd để disable web sercurity
    //"C:\Program Files\Google\Chrome\Application\chrome.exe" --disable-web-security --disable-gpu --user-data-dir=~/chromeTemp
    request : function(requestType, url, data)
    {
        var ajaxOptions =  {
            url : this.apiUrl + url,
            type : requestType,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: null
        }
        if (ajaxOptions.type.toUpperCase() == "GET") {
            ajaxOptions.data = data;
        } else if (ajaxOptions.contentType == "application/json; charset=utf-8") {
            ajaxOptions.data = data ? JSON.stringify(data) : null;
        }
        return $.ajax(ajaxOptions);
    },

    get: function (url, data) {
        return this.requestWithAuthentication("GET", url, data);
    },
    post: function (url, data) {
        return this.requestWithAuthentication("POST", url, data);
    },
    put: function (url, data) {
        return this.requestWithAuthentication("PUT", url, data);
    },
    delete: function (url, data) {
        return this.requestWithAuthentication("DELETE", url, data);
    },

    requestWithAuthentication : function(requestType, url, data)
    {
        //5.lấy accesstoken
        var token = this.getAccessToken();
        //6. kiêm tra token hết hạn hay chưa
        if (token) {
            //nếu access token hết hạn, gửi refresh token để lấy token mớI
            if (new Date(token['expires']) <= new Date() && token.refresh_token) {
                this.refreshToken(token.refresh_token);
                window.location.href = "../Login_v1/Login.html";
            }
        }
        //7. gửi access token cùng request
        var ajaxOptions =  {
            url : this.apiUrl + url,
            type : requestType,
            data: data,
            contentType: "application/x-www-form-urlencoded",
            dataType: "Json",
            //set Bearer token vào header của request
            headers : {
                'authorization': `Bearer ${token.access_token}`,
            }
        };
        if (ajaxOptions.type.toUpperCase() == "GET") {
            ajaxOptions.data = data;
        } else if (ajaxOptions.contentType == "application/json; charset=utf-8") {
            ajaxOptions.data = data ? JSON.stringify(data) : null;
        }
        return $.ajax(ajaxOptions);
    },

    login: function (username, password) {
        var self = this;
        var userInfo = {
            userName: username,
            passWord: password,
        };
        //1. call api để xác thực người dùng
        return $.ajax({
            type: "POST",
            data: userInfo,
            url: this.apiUrl + "auth",
            contentType: "application/x-www-form-urlencoded",
            dataType: "Json",
            //2. trả về thông tin của token
            success: function (token) {
                //3. Lưu thông tin token
                //hàm lưu token
                self.setAccessToken(token);
                //xoá message lỗi nếu có
                $("#messageLoginError").html("");
                //4.chuyển về trang sản phẩM
                window.location.href = "../HTML/product.html";
            },
            error: function(response){
                //hiển thị lỗi nếu login không thành công.
                $("#messageLoginError").html(response.responseJSON);
            }
        });
    },
    getAccessToken: function () {
        return JSON.parse(sessionStorage.getItem("_accessToken"));
    },
    setAccessToken : function(token) {
        sessionStorage.setItem("_accessToken", JSON.stringify(token));
    },
    refreshToken: function (refreshToken) {
        var self = this;
        // remove current access token
        self.setAccessToken(null);
        // refresh the access token
        var data = {
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        };
        return $.ajax({
            type: 'POST',
            data: data,
            url: this.apiUrl + 'auth',
            contentType: "application/x-www-form-urlencoded",
            dataType: 'Json',
        }).success(function (token) {
            self.setAccessToken(token);
        });
    },
}