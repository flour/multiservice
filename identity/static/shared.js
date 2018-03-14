function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function addCookie(name, value) {
    var date = new Date(new Date().getTime() + 60 * 60 * 24 * 7 * 1000); // week
    document.cookie = name + "=" + value + "; path=/; expires=" + date.toUTCString();
}