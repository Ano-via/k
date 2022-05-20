var twofarequest=document.getElementById("twofarequest");
function HOTP(K, C)
{
	var key = sjcl.codec.base32.toBits(K);
	// Count is 64 bits long.  Note that JavaScript bitwise operations make
	// the MSB effectively 0 in this case.
	var count = [((C & 0xffffffff00000000) >> 32), C & 0xffffffff];
	var otplength = 6;

	var hmacsha1 = new sjcl.misc.hmac(key, sjcl.hash.sha1);
	var code = hmacsha1.encrypt(count);

	var offset = sjcl.bitArray.extract(code, 152, 8) & 0x0f;
	var startBits = offset * 8;
	var endBits = startBits + 4 * 8;
	var slice = sjcl.bitArray.bitSlice(code, startBits, endBits);
	var dbc1 = slice[0];
	var dbc2 = dbc1 & 0x7fffffff;
	var otp = dbc2 % Math.pow(10, otplength);
	var result = otp.toString();
	while (result.length < otplength)
	{
		result = '0' + result;
	}
	return result;
}
function gettfa()
{
   var secret = document.getElementById('twofarequest').value;
   var ctime = Math.floor((new Date() - 0) / 30000);
   var otp = HOTP(secret, ctime);
   document.getElementById("twofaresult").value = otp;
}
function normal8() {
	var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var passwordLength = 8;
	var password = "";
	for (var i = 0; i <= passwordLength; i++) {
			var randomNumber = Math.floor(Math.random() * chars.length);
			password += chars.substring(randomNumber, randomNumber +1);
		}
		document.getElementById("password").value = password;
}
function complex16() {
	var chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var passwordLength = 16;
	var password = "";
	for (var i = 0; i <= passwordLength; i++) {
		var randomNumber = Math.floor(Math.random() * chars.length);
		password += chars.substring(randomNumber, randomNumber +1);
	}
	document.getElementById("password").value = password;
}
function normal16() {
	var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var passwordLength = 16;
	var password = "";
	for (var i = 0; i <= passwordLength; i++) {
		var randomNumber = Math.floor(Math.random() * chars.length);
		password += chars.substring(randomNumber, randomNumber +1);
	}
	document.getElementById("password").value = password;
}
function copyPassword() {
	var copyText = document.getElementById("password");
	copyText.select();
	copyText.setSelectionRange(0, 999);
	document.execCommand("copy");
}
function dividetext() {
	var ptext = document.getElementById("pastetext").value;
	ptext = ptext.replace(/\|\|\|/g,"\n");
	ptext = ptext.replace(/\|\|/g,"\n");
	ptext = ptext.replace(/\|/g,"\n");
	ptext = ptext.replace(/---/g,"\n");
	ptext = ptext.replace(/--/g,"\n");
	document.getElementById("dividedtext").value = ptext;		
	if (/[A-Za-z0-9]{32}/g.test(ptext) === true) {
		var twofact = /[A-Z0-9]{32}/g.exec(ptext);
	} 
	else {
		var twofact = /[A-Z0-9]{4}\s[A-Za-z0-9]{4}\s[A-Za-z0-9]{4}\s[A-Za-z0-9]{4}\s[A-Za-z0-9]{4}\s[A-Za-z0-9]{4}\s[A-Za-z0-9]{4}\s[A-Za-z0-9]{4}/g.exec(ptext);
	}
	document.getElementById("twofarequest").value = twofact;
	var timestamp1 = Date.parse( new Date());
	var tc = Math.floor(timestamp1/30000);
	gettfa();
}
