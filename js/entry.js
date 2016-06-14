var $ = require('jquery');

var module1 = (function(){
	var fun1 = function (x) {
		console.log(x);
		$('body').append('<p>'+ x +'</p>');
	};
	
	return {
		fun1 : fun1
	}
})('$');

module.exports = module1;

//通常写法exports = module.exports = somethings;

//也可以这样写
// function module1 () {
// 	var name;

// 	this.fun1 = function (x) {
// 		console.log(x);
// 		$('body').append('<p>'+ x +'</p>');
// 	}
// }