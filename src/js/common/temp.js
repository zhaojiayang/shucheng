define([
    'jquery',
    'handlebars'
], function($, Handlebars) {
    return function(text, data, parent, flag) {
        var compile = Handlebars.compile(text);
        Handlebars.registerHelper('finish', function(items) {
            if (items) {
                return '完结'
            } else {
                return '连载中...'
            }
        });
        Handlebars.registerHelper('finish', function(items){
            return Math.round(items / 10000);
        })
        Handlebars.registerHelper('updataTime', function(items){
            var date = new Date();
            return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()
        })
        if (flag) {
            $(parent).append(compile(data));
        } else {
            $(parent).html(compile(data));
        }
    }
});