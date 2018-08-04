;
LoadProducts = (element) => {
    axios.get('poddony.json')
        .then((response) => {
            //Вывод категорий
            let categoryPills = 
            `<ul class="nav nav-pills ml-5 pt-3" id="products-pills" role="tablist">
                <li class="nav-item">
                    <a class="nav-link active" id="products-hits-tab" data-toggle="pill" href="#products-hits" role="tab" aria-controls="products-hits" aria-selected="true">Хиты продаж</a>
                </li>`
            + response.data.categories.map((categoryData,index) => {
                return `  <li class="nav-item">
                        <a class="nav-link" id="products-${categoryData.id}-tab" data-toggle="pill" href="#products-${categoryData.id}" role="tab" aria-controls="products-${categoryData.id}"
                            aria-selected="false">${categoryData.name}</a>
                    </li>`}).join('')
            + `</ul>`;
            //Вывод самих продуктов
            let productDeck = 
            `<div class="tab-content" id="products-pills-content">
                <div class="tab-pane fade show active" id="products-hits" role="tabpanel" aria-labelledby="products-hits-tab">`
                + productCardDeck(response.data.products.filter(productData => productData.hit))
                + `</div>` 
            //here will be categorized tabs
            + response.data.categories.map((categoryData,index) => {
                return `<div class="tab-pane fade" id="products-${categoryData.id}" role="tabpanel" aria-labelledby="products-${categoryData.id}-tab">`
                        + productCardDeck(response.data.products.filter(productData => productData.category === categoryData.id))
                        +`</div>`
            });
            element.innerHTML = categoryPills + productDeck;
        });
};

productCardDeck = (products) => {
    let deck = ``;
    let columns = 3;
    if (!(products.length %  3 == 0) && (products.length % 4 == 0)) {
        columns = 4;
    };
    let rows = Math.ceil(products.length / columns);
     for (let currentRow = 1; currentRow <= rows; currentRow++) {
         deck += `<div class="card-deck palletes-cards pt-1 mt-0">`
         for (let currentColumn = 1; currentColumn <= columns; currentColumn ++) {
            index = (currentRow - 1) * columns + (currentColumn - 1);
            if (index < products.length) {
                deck += productCardElement(products[index]);
            }  else
            {
                deck += `<div class="card invisible"></div>`;
            };
         };
         deck += `</div>`;
     };
     return deck;
};

productCardElement = (productData) => {
    return `                
    <div class="card">`
    + (productData.link ? `<a href="${productData.link}"> ` : ``)
        + `<img class="card-img-top" src="${productData.imageFile}" alt="${productData.name}">`
    + (productData.link ? ` </a>` : ``)
    +`<div class="card-body">
        <h5 class="card-title text-center">${productData.name}</h5>
        <p class="card-text">`
            + (productData.size ? `<span>Размер: </span>${productData.size}<br>` : ``)
            + (productData.leverage ? `<span>Грузоподъемность: </span>${productData.leverage}<br>` : ``)
    +`</p> </div>
    <div class="card-footer">
        <p class="text-center">
            <span>Цена:</span> ${productData.price}р за шт.</p>
    </div>
</div>

    `;
};