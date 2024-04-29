const weatherAPIKey = "084c19ffb4ad95909574f86711847042";
const weatherAPIURL = "https://api.openweathermap.org/data/2.5/weather?lat=57&lon=-2.15&appid={API key}&units=metric"

const galleryImage = [{
    src: "./assets/gallery/image1.jpg",
    alt: "Thumbnail Image 1"
}, {
    src: "./assets/gallery/image2.jpg",
    alt: "Thumbnail Image 2"
}, {
    src: "./assets/gallery/image3.jpg",
    alt: "Thumbnail Image 3"
}];

const products = [
    {
        title: "AstroFiction",
        author: "John Doe",
        price: 49.9,
        image: "./assets/products/img6.png"
    },
    {
        title: "Space Odissey",
        author: "Marie Anne",
        price: 35,
        image: "./assets/products/img1.png"
    },
    {
        title: "Doomed City",
        author: "Jason Cobert",
        price: 0,
        image: "./assets/products/img2.png"
    },
    {
        title: "Black Dog",
        author: "John Doe",
        price: 85.35,
        image: "./assets/products/img3.png"
    },
    {
        title: "My Little Robot",
        author: "Pedro Paulo",
        price: 0,
        image: "./assets/products/img5.png"
    },
    {
        title: "Garden Girl",
        author: "Ankit Patel",
        price: 45,
        image: "./assets/products/img4.png"
    }
];

function menuHandler() {
    document.querySelector("#open-nav-menu").addEventListener("click", function () {
        document.querySelector("header nav .wrapper").classList.add("nav-open");
    })

    document.querySelector("#close-nav-menu").addEventListener("click", function () {
        document.querySelector("header nav .wrapper").classList.remove("nav-open");
    })
}

function celToFahr(temp) {
    let fahr = (temp * 9 / 5) + 32;
    return fahr;
}

function weatherHandler(){
    navigator.geolocation.getCurrentPosition(position => {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        let url = weatherAPIURL.replace("{lat}", latitude).replace("{lon}", longitude).replace("{API key}", weatherAPIKey);
        fetch(url).then(response => response.json())
            .then(data => {
                const location = data.name;
                const condition = data.weather[0].description;
                const temp = data.main.temp;
    
                celText = `The weather is ${condition} in ${location} and it's ${temp}°C outside`
                fahrText = `The weather is ${condition} in ${location} and it's ${celToFahr(temp)}°F outside`
                document.querySelector("#weather").innerHTML = celText;

                document.querySelector("div.weather-group").addEventListener("click", function (e) {
    
                    if (e.target.id == "celsius") {
                        document.querySelector("#weather").innerHTML = celText;
                    }
                    else if (e.target.id == "fahr") {
                        document.querySelector("#weather").innerHTML = fahrText;
                    }
                })
            }).catch((err => {
                document.querySelector("p#weather").innerHTML = "Unable to get the weather info. Try again later.";
            }));
    })
}


function greetingHandler() {
    let greeting;
    let currentHour = new Date().getHours();

    if (currentHour < 12) {
        greeting = "Good Morning";
    }
    else if (currentHour < 19) {
        greeting = "Good Afternoon";
    }
    else if (currentHour < 24) {
        greeting = "Good Evening";
    }
    else {
        greeting = "Welcome";
    }
    document.querySelector("#greeting").innerHTML = greeting;


}

function clockHandler() {
    setInterval(function () {
        let localtime = new Date();

        document.querySelector("span[data-time='hours']").textContent = localtime.getHours().toString().padStart(2, "0");
        document.querySelector("span[data-time='minutes']").textContent = localtime.getMinutes().toString().padStart(2, "0");
        document.querySelector("span[data-time='seconds']").textContent = localtime.getSeconds().toString().padStart(2, "0");
    }, 1000)
}

function galleryHandler() {
    let mainImage = document.querySelector("#gallery > img");
    let thumbnails = document.querySelector("#gallery .thumbnails");

    mainImage.src = galleryImage[0].src;
    mainImage.alt = galleryImage[0].alt;

    galleryImage.forEach(function (image, index) {
        let thumb = document.createElement("img");
        thumb.src = image.src;
        thumb.alt = image.alt;
        thumb.dataset.arrayIndex = index;
        thumb.dataset.selected = index === 0 ? true : false;

        thumb.addEventListener("click", function (e) {
            let index = e.target.dataset.arrayIndex;
            let image = galleryImage[index];
            mainImage.src = image.src;
            mainImage.alt = image.alt;

            thumbnails.querySelectorAll("img").forEach(function (img) {
                img.dataset.selected = false;
            });
            e.target.dataset.selected = true;
        });


        thumbnails.appendChild(thumb);
    })
}

function populateProduct(productList) {
    let productSection = document.querySelector(".products-area")
    productSection.textContent = "";
    productList.forEach(function (product, index) {
        let temp = document.createElement("div");
        temp.classList.add("product-item");

        let productImage = document.createElement("img");
        productImage.src = product.image;
        productImage.alt = "Image of " + product.title;
        temp.append(productImage);

        let productDetails = document.createElement("div");
        productDetails.classList.add("product-details");

        let productTitle = document.createElement("h3");
        productTitle.classList.add("product-title");
        productTitle.innerHTML = product.title;
        productDetails.append(productTitle);

        let productAuthor = document.createElement("p");
        productAuthor.classList.add("product-author");
        productAuthor.innerHTML = product.author;
        productDetails.append(productAuthor);

        let priceTitle = document.createElement("p");
        priceTitle.classList.add("price-title");
        priceTitle.innerHTML = "Price";
        productDetails.append(priceTitle);

        let productPrice = document.createElement("p");
        productPrice.classList.add("product-price");
        // let price=product.price;
        // if()
        productPrice.innerHTML = product.price > 0 ? "$" + product.price.toFixed(2) : "Free";
        productDetails.append(productPrice);

        temp.append(productDetails);
        productSection.append(temp);

    });

}

function productHandler() {

    let paidProducts = products.filter(function (item) {
        return item.price > 0;
    })
    let freeProducts = products.filter(function (item) {
        return item.price <= 0 || !item.price;
    })

    populateProduct(products);

    document.querySelector("label[for='all']>span").innerHTML = products.length;
    document.querySelector("label[for='paid']>span").innerHTML = paidProducts.length;
    document.querySelector("label[for='free']>span").innerHTML = freeProducts.length;

    let productFilter = document.querySelector(".products-filter");
    productFilter.addEventListener("click", function (e) {
        if (e.target.id === "all") {
            populateProduct(products);
        }
        else if (e.target.id === "paid") {
            populateProduct(paidProducts);
        }
        else if (e.target.id === "free") {
            populateProduct(freeProducts);
        }
    });
}

function fooderHandler() {
    let currentYear = new Date().getFullYear();
    document.querySelector("footer").innerHTML = `© ${currentYear} - All rights reserved`
}




// Page Loader
menuHandler();
greetingHandler();
clockHandler();
galleryHandler();
productHandler();
fooderHandler();
weatherHandler();