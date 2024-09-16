function setCookie(name, value, options = {}) {

    options = {
        path: '/',
        // agregar otros valores predeterminados si es necesario
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
        updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}

// devuelve la cookie con el nombre dado,
// o undefined si no la encuentra
function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function checkCookie(){
    let quantity = getCookie("quantity")
    if(quantity===undefined){
        setCookie('quantity', '0', {secure: true, 'max-age': 3600});
    }
}

function restQuantity(quantity){
    let cartQuantity =  getCookie("quantity")
    let total = cartQuantity - quantity
    setCookie('quantity', total, {secure: true, 'max-age': 3600});

}

function resetQuantity(){
    setCookie('quantity', 0, {secure: true, 'max-age': 3600});

}