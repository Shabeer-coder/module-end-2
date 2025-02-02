let allProducts = [];

const fetchData = async () => {
    try {
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();

        allProducts = data.map((product) => {
            const hiddenColors = ["#FF5733", "#33FF57", "#3357FF", "#F1C40F", "#8E44AD"];
            return {
                ...product,
                hiddenColor: hiddenColors[Math.floor(Math.random() * hiddenColors.length)],
            };
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

const displayData = (data) => {
    const productsHtml = data
        .map((product) => {
            const stars = Array(Math.round(product.rating.rate))
                .fill("&#9733;")
                .join("") +
                Array(5 - Math.round(product.rating.rate))
                    .fill("&#9734;")
                    .join("");

            return `
                <div class="product" data-category="${product.category}" style="border: 2px solid ${product.hiddenColor}; padding: 10px; border-radius: 8px;">
                    <img src="${product.image}" alt="${product.title}">
                    <h4>${product.title}</h4>
                    <p class="category">Category: ${product.category}</p>
                    <p class="price">$${product.price.toFixed(2)}</p>
                    <p class="rating">${stars}</p>
                    <p class="hidden-color" style="color: ${product.hiddenColor}; font-size: 12px;">Hidden Color: ${product.hiddenColor}</p>
                    <button class="btn btn-outline-danger">Add to Wishlist</button>
                </div>
            `;
        })
        .join("");

    const productElement = document.querySelector(".products");
    productElement.innerHTML = productsHtml;
};

function closePopup() {
    document.getElementById("popup-ad").style.display = "none";
}

function toggleFilter() {
    var filterSidebar = document.getElementById('filterSidebar');
    filterSidebar.style.display = filterSidebar.style.display === "none" || filterSidebar.style.display === "" ? "block" : "none";
}

const filterProducts = () => {
    const selectedCategories = [...document.querySelectorAll('.filter-group input[type="checkbox"]:checked')].map(
        (checkbox) => checkbox.value.toLowerCase()
    );
    const priceRange = parseFloat(document.getElementById("priceRange").value);
    const filteredProducts = allProducts.filter((product) => {
        const productCategory = product.category.toLowerCase();
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(productCategory);
        const matchesPrice = product.price <= priceRange;

        return matchesCategory && matchesPrice;
    });

    displayData(filteredProducts);
};

const updatePriceLabel = () => {
    const priceRange = document.getElementById("priceRange");
    const priceLabel = document.getElementById("priceLabel");
    priceLabel.textContent = `$${priceRange.value} - $500+`;
    priceLabel.textContent = `$${priceRange.value} - $1001+`;
    filterProducts();
};

const filterProductsWithSidebar = (category) => {
    const filteredProducts = allProducts.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
    );
    displayData(filteredProducts);
    
    document.querySelector("#filterSidebar").style.display = "block";
    document.getElementById("category-heading").textContent = `${category}`;
    document.getElementById("category-heading").style.textTransform = "capitalize";
};

const clearAllFilters = () => {
    document.querySelectorAll('.filter-group input[type="checkbox"]').forEach((checkbox) => {
        checkbox.checked = false;
    });

    const priceRange = document.getElementById("priceRange");
    priceRange.value = priceRange.min;
    updatePriceLabel();

    displayData(allProducts);
};

const searchProducts = () => {
    const searchTerm = document.getElementById('search').value.toLowerCase();

    const filteredProducts = allProducts.filter(product =>
        product.title.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );

    if (filteredProducts.length === 0) {
        document.getElementById("no-results-message").style.display = "block";
    } else {
        document.getElementById("no-results-message").style.display = "none";
    }

    displayData(filteredProducts);
};

document.getElementById("search").addEventListener("input", searchProducts);

const toggleExtraColors = () => {
    const extraColors = document.getElementById("extraColors");
    const toggleButton = document.getElementById("toggleColors");

    if (extraColors.style.display === "none") {
        extraColors.style.display = "block";
        toggleButton.textContent = "Less (-3 more)";
    } else {
        extraColors.style.display = "none";
        toggleButton.textContent = "More (+3 more)";
    }
};

window.onload = function () {
    document.querySelector("#filterSidebar").style.display = "none";

    fetchData();
    setTimeout(function () {
        document.getElementById("popup-ad").style.display = "flex";
    }, 3000);
};