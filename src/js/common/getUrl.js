define(function(){
    return function(n){
        var str = window.location.search.substr(i);
        var arr = str.split("&");
        arr.map(function(v, i){
            if(v.split('=')[0] === n){
                res = v.split('=')[1];
            }
        });
        return res;
    }
})