module.exports.doDivision = function(a,b) {
    return a/b;
}

module.exports.stringifyDivision = function(a,b) {
    return a + " divided by " + b + " is " + module.exports.doDivision(a,b);
}