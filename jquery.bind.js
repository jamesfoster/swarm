$.bind = function(object, method){
    var args = Array.prototype.slice.call(arguments, 2);
    return function() {
        var args2 = args.concat($.makeArray( arguments ));
        return method.apply(object, args2);
    };
};
