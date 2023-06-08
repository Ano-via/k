var twofarequest = document.getElementById("twofarequest");
function HOTP(K, C) {
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
    while (result.length < otplength) {
        result = '0' + result;
    }
    return result;
}
function gettfa() {
    var secret = document.getElementById('twofarequest').value;
    if (secret.length > 0) {
        var ctime = Math.floor((new Date() - 0) / 30000);
        var otp = HOTP(secret, ctime);
        document.getElementById("twofaresult").value = otp;
    }
}
function refresh() {
    var ptext = document.getElementById("pastetext").value;
    var ptextresult = document.getElementById("dividedtext").value;
    if (ptext.length > 0 && ptextresult.length == 0) {
        dividetext();
    }
    var secret = document.getElementById('twofarequest').value;
    if (secret.length > 0) {
        var ifTfa = document.getElementById('twofaresult').value;
        if (ifTfa.length == 0) {
            gettfa();
            copytfa();
        }
        var refreshtime = 30 - Math.floor(((new Date() - 0) % 30000) / 1000);
        document.getElementById("refreshtime").value = "还剩" + refreshtime + "秒";
        if (refreshtime == 30) {
            gettfa();
            document.getElementById("copytfa").innerHTML = "复制验证码";
            var obj = document.getElementById('copytfa');
            obj.style.backgroundColor = "#f2f2f2";
            obj.style.color = "#000000";
        } else if (refreshtime <= 3) {
            var obj = document.getElementById('copytfa');
            obj.style.backgroundColor = "#ffeae6";
            obj.style.color = "#991a00";
        }
    }
}

function normal8() {
    var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var passwordLength = 8;
    var password = "";
    for (var i = 0; i <= passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
    }
    document.getElementById("password").value = password;
}
function complex16() {
    var chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var passwordLength = 16;
    var password = "";
    for (var i = 0; i <= passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
    }
    document.getElementById("password").value = password;
}
function normal16() {
    var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var passwordLength = 16;
    var password = "";
    for (var i = 0; i <= passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
    }
    document.getElementById("password").value = password;
}
function copyPassword() {
    var copyText = document.getElementById("password");
    copyText.select();
    copyText.setSelectionRange(0, 999);
    document.execCommand("copy");
}
function copytfa() {
    var ifTfa = document.getElementById("twofaresult").value;
    if (ifTfa.length > 0) {
        var copyTfaresult = document.getElementById("twofaresult");
        copyTfaresult.select();
        copyTfaresult.setSelectionRange(0, 999);
        document.execCommand("copy");
        document.getElementById("copytfa").innerHTML = "√ 已复制验证码";
        var obj = document.getElementById('copytfa');
        obj.style.backgroundColor = "#daf2c2";
        obj.style.color = "#397300";
    } else {
        document.getElementById("copytfa").innerHTML = "没有验证码";
    }
}
function dividetext() {
    var ptext = document.getElementById("pastetext").value;
    ptext = ptext.replace(/\|\|\|/g, "\n");
    ptext = ptext.replace(/\|\|/g, "\n");
    ptext = ptext.replace(/\|/g, "\n");
    ptext = ptext.replace(/---/g, "\n");
    ptext = ptext.replace(/--/g, "\n");
    ptext = ptext.replace(/\t/g, "\n");
    ptext = ptext.replace(/\u0020/g, "");
    document.getElementById("dividedtext").value = ptext;
    document.getElementById("metalink").setAttribute("href", "https://mbasic.facebook.com?email=" + ptext.substring(0, ptext.indexOf("\n")) + "&pass=" + ptext.substring(ptext.indexOf("\n") + 1, ptext.indexOf("\n", ptext.indexOf("\n") + 1)))
    var twofact = /[A-Z0-9]{32}/g.exec(ptext);
    document.getElementById("twofarequest").value = twofact;
    var timestamp1 = Date.parse(new Date());
    var tc = Math.floor(timestamp1 / 30000);
    gettfa();
    copytfa();
}

function openlinks() {
    var linksstr = document.getElementById("linksstr").value;
    linklist = linksstr.split("\n");
    for (i = 0; i < linklist.length; i++) {
        s = linklist[i];
        window.open(s);
    }
}

function svttrack() {
    var linksstr = document.getElementById("linksstr").value;
    linksstr = "https://t.17track.net/zh-cn?v=2#nums=" + linksstr;
    var len = linksstr.split("\n").length;
    for (var i = 1; i <= len; i++) {
        if (i % 40 == 0) {
            linksstr = linksstr.replace("\n", "Enter2Replacehttps://t.17track.net/zh-cn?v=2#nums=");
        } else {
            linksstr = linksstr.replace("\n", ",");
        }
    }
	linksstr = linksstr.replace(/,,/g, ",");
    linksstr = linksstr.replace(/Enter2Replace/g, "\n");
    if (linksstr.charAt(linksstr.length - 1) == ",") {
        linksstr = linksstr.substring(0, linksstr.length - 1);
    }
    if (linksstr.charAt(linksstr.length - 1) == "=") {
        linksstr = linksstr.substring(0, linksstr.length - 38);
    }
    linklist = linksstr.split("\n");
    for (i = 0; i < linklist.length; i++) {
        s = linklist[i];
        window.open(s);
    }
}

function soetrack() {
    var linksstr = document.getElementById("linksstr").value;
    linksstr = "https://www.track718.us/zh-CN/detail?nums=" + linksstr;
    var len = linksstr.split("\n").length;
    for (var i = 1; i <= len; i++) {
        if (i % 40 == 0) {
            linksstr = linksstr.replace("\n", "Enter2Replacehttps://www.track718.us/zh-CN/detail?nums=");
        } else {
            linksstr = linksstr.replace("\n", ",");
        }
    }
	linksstr = linksstr.replace(/,,/g, ",");
    linksstr = linksstr.replace(/Enter2Replace/g, "\n");
    if (linksstr.charAt(linksstr.length - 1) == ",") {
        linksstr = linksstr.substring(0, linksstr.length - 1);
    }
    if (linksstr.charAt(linksstr.length - 1) == "=") {
        linksstr = linksstr.substring(0, linksstr.length - 43);
    }
    linklist = linksstr.split("\n");
    for (i = 0; i < linklist.length; i++) {
        s = linklist[i];
        window.open(s);
    }
}

function delparentheses() {
	var linksstr = document.getElementById("linksstr").value;
	var result = linksstr.replace(/ *\([^)]*\)/g, "");
	document.getElementById("linksstr").value = result;
	var copyText = document.getElementById("linksstr");
    copyText.select();
    copyText.setSelectionRange(0, 999);
    document.execCommand("copy");
	document.getElementById("delparentheses").innerHTML = "√ 已复制";
	var obj = document.getElementById('delparentheses');
	obj.style.backgroundColor = "#daf2c2";
	obj.style.color = "#397300";
	setTimeout(function(){
		obj.innerHTML = "去括号 + 复制";
		obj.style.backgroundColor = "#f2f2f2";
		obj.style.color = "#000000";
	}, 3000);
}

function generateUPC() {
	var linksstrElement = document.getElementById("linksstr");
	var content = linksstrElement.value;
	var numbers = content.replace(/[a-zA-Z-]/g, "");
	var lines = numbers.split("\n");
	var processedNumbers = [];
	for (var i = 0; i < lines.length; i++) {
		var number = lines[i];
		if (number.length < 11) {
			number = number.padEnd(11, "0");
		}
		else if (number.length > 11) {
			number = number.substring(0, 11);
		}
		var sum = 0;
		for (var j = 0; j < 11; j++) {
			var digit = parseInt(number[j]);
			sum += (j % 2 === 0) ? digit * 3 : digit;
		}
		var checkDigit = (10 - (sum % 10)) % 10;
		number += checkDigit;
		processedNumbers.push(number);
	}
	linksstrElement.value = processedNumbers.join("\n");
	var copyText = document.getElementById("linksstr");
		copyText.select();
		copyText.setSelectionRange(0, 999);
		document.execCommand("copy");
	document.getElementById("bulkupc").innerHTML = "√ 已复制";
	var obj = document.getElementById('bulkupc');
	obj.style.backgroundColor = "#daf2c2";
	obj.style.color = "#397300";
	setTimeout(function(){
		obj.innerHTML = '<img height="50%" src="https://img.icons8.com/pulsar-color/48/barcode.png" alt="upc"/>&nbsp;批量UPC';
		obj.style.backgroundColor = "#f2f2f2";
		obj.style.color = "#000000";
	}, 3000);
}

function multiTranslate() {
    var appid = '20210514000826949';
    var key = 'ML9wLZ6X0RqB4gjwmpXN';
    var salt = (new Date).getTime();
    var query = document.getElementById("linksstr").value; // 获取id为linksstr的内容
    var from = 'auto'; // 源语言为自动检测
    var toLanguages = ['spa', 'fra', 'de', 'jp', 'kor', 'ru', 'ara', 'it', 'pt']; // 目标语言数组
    var translations = [];
    var obj = document.getElementById('multitranslate');
    obj.style.backgroundColor = "#e5e5e5";
    obj.style.color = "#7e7e7e";

    function translateText(index) {
        document.getElementById("multitranslate").innerHTML = "翻译中 （" + (9 - index) + "s）";
        if (index >= toLanguages.length) {
            var result = translations.join(', ');
            console.log(result);
            var copyText = document.getElementById("linksstr");
            copyText.select();
            copyText.setSelectionRange(0, 999);
            document.execCommand("copy");
            document.getElementById("multitranslate").innerHTML = "√ 已复制";
            obj.style.backgroundColor = "#daf2c2";
            obj.style.color = "#397300";
            setTimeout(function () {
                obj.innerHTML = "多重翻译";
                obj.style.backgroundColor = "#f2f2f2";
                obj.style.color = "#000000";
            }, 3000);
            return;
        }

        var to = toLanguages[index];
        console.log(to);
        var str1 = appid + query + salt + key;
        var sign = MD5(str1);

        $.ajax({
            url: 'http://api.fanyi.baidu.com/api/trans/vip/translate',
            type: 'get',
            dataType: 'jsonp',
            data: {
                q: query,
                appid: appid,
                salt: salt,
                from: from,
                to: to,
                sign: sign
            },
            success: function (data) {
                console.log(data);
                translations.push(data.trans_result[0].dst.toLowerCase());
                console.log(translations);
                document.getElementById("linksstr").value = translations;
                setTimeout(function () {
                    translateText(index + 1); // 递归调用翻译下一个语言
                }, 1000); // 等待1秒钟
            }
        });
    }

    translateText(0); // 开始翻译第一个语言
setInterval("refresh()", 1000);
