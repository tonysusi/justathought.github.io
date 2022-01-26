(function($) {
    'use strict';
    $.RestClient = function(baseUrl, apikey) {
        this.baseUrl = baseUrl;
        this.apikey = apikey;
        return this;
    }
    ;
    $.RestClient.prototype.read = function(resource, callback) {
        $.ajax({
            method: 'GET',
            dataType: 'json',
            url: this.baseUrl + resource,
            success: callback,
            headers: {
                ApiKey: this.apikey
            }
        });
    }
    ;
    $.RestClient.prototype.post = function(resource, data, callback) {
        $.ajax({
            method: 'POST',
            dataType: 'json',
            url: this.baseUrl + resource,
            success: callback,
            data: data,
            headers: {
                ApiKey: this.apikey
            }
        });
    }
    ;
    $.RestClient.prototype.put = function(resource, data, callback) {
        $.ajax({
            method: 'PUT',
            dataType: 'json',
            url: this.baseUrl + resource,
            success: callback,
            data: data,
            headers: {
                ApiKey: this.apikey
            }
        });
    }
    ;
    $.RestClient.prototype.delete = function(resource, callback) {
        $.ajax({
            method: 'DELETE',
            dataType: 'json',
            url: this.baseUrl + resource,
            success: callback,
            headers: {
                ApiKey: this.apikey
            }
        });
    }
    ;
}
)(jQuery);
