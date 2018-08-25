'use strict';

;
var LoadProducts = function LoadProducts(host, element) {
    axios.get(host + '/poddony.json').then(function (response) {
        //Вывод категорий
        var categoryPills = '<ul class="nav nav-pills ml-5 pt-3" id="products-pills" role="tablist">\n                <li class="nav-item">\n                    <a class="nav-link active" id="products-hits-tab" data-toggle="pill" href="#products-hits" role="tab" aria-controls="products-hits" aria-selected="true">\u0425\u0438\u0442\u044B \u043F\u0440\u043E\u0434\u0430\u0436</a>\n                </li>' + response.data.categories.map(function (categoryData, index) {
            return '  <li class="nav-item">\n                        <a class="nav-link" id="products-' + categoryData.id + '-tab" data-toggle="pill" href="#products-' + categoryData.id + '" role="tab" aria-controls="products-' + categoryData.id + '"\n                            aria-selected="false">' + categoryData.name + '</a>\n                    </li>';
        }).join('') + '</ul>';
        //Вывод самих продуктов
        var productDeck = '<div class="tab-content" id="products-pills-content">\n                <div class="tab-pane fade show active" id="products-hits" role="tabpanel" aria-labelledby="products-hits-tab">' + productCardDeck(response.data.products.filter(function (productData) {
            return productData.hit;
        }), false, host) + '</div>'
        //here will be categorized tabs
        + response.data.categories.map(function (categoryData, index) {
            return '<div class="tab-pane fade" id="products-' + categoryData.id + '" role="tabpanel" aria-labelledby="products-' + categoryData.id + '-tab">' + productCardDeck(response.data.products.filter(function (productData) {
                return productData.category === categoryData.id;
            }), false, host) + '</div>';
        }).join('');
        element.innerHTML = categoryPills + productDeck;
    });
};

var LoadSetOfProducts = function LoadSetOfProducts(host, element, categoryId) {
    axios.get(host + '/poddony.json').then(function (response) {
        //Вывод самих продуктов
        element.innerHTML = productCardDeck(response.data.products.filter(function (productData) {
            return productData.category === categoryId;
        }), true, host);
    });
};

var LoadSingleProduct = function LoadSingleProduct(host, element, categoryId) {
    var num = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    axios.get(host + '/poddony.json').then(function (response) {
        //Вывод самих продуктов
        console.log(response.data.products.filter(function (productData) {
            return productData.category === categoryId;
        }));
        element.innerHTML = productCardElement(response.data.products.filter(function (productData) {
            return productData.category === categoryId;
        })[num], host);
    });
};

var productCardDeck = function productCardDeck(products, singlePack, host) {
    var hostname = host ? host : '';
    var deck = '';
    var columns = 4;
    //let columns = 3;
    //if (!(products.length %  3 == 0) && (products.length % 4 == 0)) {
    //    columns = 4;
    //};
    var rows = Math.ceil(products.length / columns);
    for (var currentRow = 1; currentRow <= rows; currentRow++) {
        deck += '<div class="card-deck palletes-cards pt-1 mt-0">';
        for (var currentColumn = 1; currentColumn <= columns; currentColumn++) {
            var index = (currentRow - 1) * columns + (currentColumn - 1);
            if (index < products.length) {
                deck += productCardElement(products[index], hostname);
            } else if (!singlePack) {
                deck += '<div class="card invisible"></div>';
            };
        };
        deck += '</div>';
    };
    return deck;
};

var productCardElement = function productCardElement(productData, host) {
    var hostname = host ? host + "/" : '';
    console.log(hostname);
    return '                \n    <div class="card">' + (productData.link ? '<a href="' + hostname + productData.link + '"> ' : '') + ('<img class="card-img-top" src="' + hostname + productData.imageFile + '" alt="' + productData.name + '">') + (productData.link ? ' </a>' : '') + ('<div class="card-body">\n        <h5 class="card-title text-center">' + productData.name + '</h5>\n        <p class="card-text">') + (productData.size ? '<span>\u0420\u0430\u0437\u043C\u0435\u0440: </span>' + productData.size + '<br>' : '') + (productData.leverage ? '<span>\u0413\u0440\u0443\u0437\u043E\u043F\u043E\u0434\u044A\u0435\u043C\u043D\u043E\u0441\u0442\u044C: </span>' + productData.leverage + '<br>' : '') + ('</p> </div>\n    <div class="card-footer">\n        <p class="text-center">\n            <span>\u0426\u0435\u043D\u0430:</span> ' + productData.price + '\u0440 \u0437\u0430 \u0448\u0442. <br> (\u0431\u0435\u0437 \u041D\u0414\u0421)</p>\n    </div>\n</div>\n\n    ');
};