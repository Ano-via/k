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
    document.getElementById("buttonc").setAttribute("href", "/?password=" + password);
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
    document.getElementById("buttonc").setAttribute("href", "/?password=" + password);
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
    document.getElementById("buttonc").setAttribute("href", "/?password=" + password);
}
function copyPassword() {
    var copyText = document.getElementById("password");
    copyText.select();
    copyText.setSelectionRange(0, 999);
    document.execCommand("copy");
    window.location.href = "/?password=" + copyText;
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
    document.getElementById("metalink").setAttribute("href", "https://mbasic.facebook.com?email=" + ptext.substring(0, ptext.indexOf("\n")))
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
setInterval("refresh()", 1000);
