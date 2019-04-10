let catalog = [
    {
        name: 'Pistolet de police',
        image: 'pistolet_de_police.jpg',
        price: 102
    },
    {
        name: 'Pistolet laser',
        image: 'pistolet_laser.jpg',
        price: 38
    },
    {
        name: 'Pistolet de cowboy',
        image: 'pistolet_de_cowboy.jpg',
        price: 50
    }
];

/************************/

let page = {};

page.initialize = function() {
    let content = "";
    for (let i = 0; i < catalog.length; i++) {
        const item = catalog[i];
        content += `
            <div class="item">
                <p>${item.name}: ${item.price} €</p>
                <p><img src="vente/${item.image}"/></p>      
                <p></p>
            </div>
        `;
    }

    dom.load("#vente", content);
}

/************************/

let dom = {};

dom.load = function(element, content) {
    let el = document.querySelector(element);
    el.innerHTML = content;
}


/************************/

window.addEventListener("load", function(event) {
    page.initialize();
});