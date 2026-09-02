"use strict";

/* =========================================================
   MY MANAGER
   PRODUCTS.JS
   ========================================================= */


/* =========================================================
   STORAGE
   ========================================================= */

const STORAGE_KEYS = {
    products: "my_manager_products",
    categories: "my_manager_categories",
    cart: "my_manager_cart",
    invoices: "my_manager_invoices",
    settings: "my_manager_store_settings"
};

const LEGACY_KEYS = {
    products: [
        "myManagerProducts",
        "products"
    ],
    categories: [
        "myManagerCategories",
        "categories"
    ],
    cart: [
        "myManagerCart",
        "cart"
    ],
    invoices: [
        "myManagerInvoices",
        "invoices"
    ],
    settings: [
        "myManagerStoreSettings",
        "storeSettings"
    ]
};


/* =========================================================
   STATE
   ========================================================= */

let products = [];
let categories = [];
let cart = [];
let invoices = [];

let storeSettings = {
    storeName: "فروشگاه من",
    phone: "",
    address: "",
    description: "",
    logo: ""
};

let currentEditingProductId = null;


/* =========================================================
   STORAGE FUNCTIONS
   ========================================================= */

function isStorageAvailable() {
    try {
        const key = "__MY_MANAGER_TEST__";

        localStorage.setItem(key, "1");

        const result =
            localStorage.getItem(key) === "1";

        localStorage.removeItem(key);

        return result;

    } catch (error) {
        console.error(error);
        return false;
    }
}


function loadJSON(key, fallback) {
    try {
        const value =
            localStorage.getItem(key);

        if (value === null) {
            return fallback;
        }

        return JSON.parse(value);

    } catch (error) {

        console.error(
            "Storage read error:",
            key,
            error
        );

        return fallback;
    }
}


function saveJSON(key, value) {

    try {

        const json =
            JSON.stringify(value);

        localStorage.setItem(
            key,
            json
        );

        const verify =
            localStorage.getItem(key);

        if (verify !== json) {
            throw new Error(
                "Storage verification failed"
            );
        }

        return true;

    } catch (error) {

        console.error(
            "Storage save error:",
            key,
            error
        );

        showToast(
            "ذخیره اطلاعات انجام نشد.",
            "error"
        );

        return false;
    }
}


function migrateLegacyStorage() {

    const map = [
        [
            "products",
            STORAGE_KEYS.products
        ],
        [
            "categories",
            STORAGE_KEYS.categories
        ],
        [
            "cart",
            STORAGE_KEYS.cart
        ],
        [
            "invoices",
            STORAGE_KEYS.invoices
        ],
        [
            "settings",
            STORAGE_KEYS.settings
        ]
    ];

    map.forEach(
        ([type, newKey]) => {

            const current =
                localStorage.getItem(
                    newKey
                );

            if (
                current !== null &&
                current !== ""
            ) {
                return;
            }

            const oldKeys =
                LEGACY_KEYS[type] || [];

            for (
                const oldKey of oldKeys
            ) {

                const oldValue =
                    localStorage.getItem(
                        oldKey
                    );

                if (
                    oldValue !== null &&
                    oldValue !== ""
                ) {

                    console.log(
                        "Migrating:",
                        oldKey,
                        "=>",
                        newKey
                    );

                    localStorage.setItem(
                        newKey,
                        oldValue
                    );

                    break;
                }
            }
        }
    );
}


function saveAll() {

    if (!isStorageAvailable()) {

        showToast(
            "ذخیره‌سازی مرورگر در دسترس نیست.",
            "error"
        );

        return false;
    }

    const results = [

        saveJSON(
            STORAGE_KEYS.products,
            products
        ),

        saveJSON(
            STORAGE_KEYS.categories,
            categories
        ),

        saveJSON(
            STORAGE_KEYS.cart,
            cart
        ),

        saveJSON(
            STORAGE_KEYS.invoices,
            invoices
        ),

        saveJSON(
            STORAGE_KEYS.settings,
            storeSettings
        )
    ];

    return results.every(Boolean);
}


function loadData() {

    migrateLegacyStorage();

    const loadedProducts =
        loadJSON(
            STORAGE_KEYS.products,
            []
        );

    const loadedCategories =
        loadJSON(
            STORAGE_KEYS.categories,
            []
        );

    const loadedCart =
        loadJSON(
            STORAGE_KEYS.cart,
            []
        );

    const loadedInvoices =
        loadJSON(
            STORAGE_KEYS.invoices,
            []
        );

    const loadedSettings =
        loadJSON(
            STORAGE_KEYS.settings,
            {}
        );


    products =
        Array.isArray(
            loadedProducts
        )
            ? loadedProducts
            : [];


    categories =
        Array.isArray(
            loadedCategories
        )
            ? loadedCategories
            : [];


    cart =
        Array.isArray(
            loadedCart
        )
            ? loadedCart
            : [];


    invoices =
        Array.isArray(
            loadedInvoices
        )
            ? loadedInvoices
            : [];


    storeSettings = {
        ...storeSettings,
        ...(loadedSettings || {})
    };


    products =
        products.map(
            product => ({
                id:
                    product.id ||
                    generateId("product"),

                name:
                    product.name || "",

                category:
                    product.category || "",

                purchasePrice:
                    number(
                        product.purchasePrice
                    ),

                salePrice:
                    number(
                        product.salePrice
                    ),

                stock:
                    number(
                        product.stock
                    ),

                code:
                    product.code || "",

                description:
                    product.description || "",

                image:
                    product.image || "",

                createdAt:
                    product.createdAt ||
                    new Date().toISOString(),

                updatedAt:
                    product.updatedAt ||
                    new Date().toISOString()
            })
        );


    categories =
        categories.map(
            category => {

                if (
                    typeof category ===
                    "string"
                ) {

                    return {
                        id:
                            generateId(
                                "category"
                            ),

                        name:
                            category
                    };
                }

                return {
                    id:
                        category.id ||
                        generateId(
                            "category"
                        ),

                    name:
                        category.name || ""
                };
            }
        );


    cart =
        cart.map(
            item => ({
                productId:
                    item.productId ||
                    item.id ||
                    "",

                quantity:
                    Math.max(
                        1,
                        number(
                            item.quantity
                        )
                    )
            })
        );


    cart =
        cart.filter(
            item =>
                products.some(
                    product =>
                        product.id ===
                        item.productId
                )
        );


    console.log(
        "MY MANAGER DATA LOADED",
        {
            products:
                products.length,

            categories:
                categories.length,

            cart:
                cart.length,

            invoices:
                invoices.length
        }
    );
}


/* =========================================================
   HELPERS
   ========================================================= */

function generateId(prefix) {

    return (
        prefix +
        "_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .substring(2, 9)
    );
}


function number(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return 0;
    }

    const cleaned =
        String(value)
            .replace(/,/g, "")
            .replace(/٬/g, "")
            .replace(/[^\d.-]/g, "");

    const result =
        Number(cleaned);

    return Number.isFinite(result)
        ? result
        : 0;
}


function formatNumber(value) {

    return number(value)
        .toLocaleString("fa-IR");
}


function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function escapeJS(value) {

    return String(
        value ?? ""
    )
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "");
}


function showToast(
    message,
    type = "success"
) {

    let container =
        document.getElementById(
            "toastContainer"
        );

    if (!container) {

        container =
            document.createElement(
                "div"
            );

        container.id =
            "toastContainer";

        document.body.appendChild(
            container
        );
    }


    const toast =
        document.createElement(
            "div"
        );

    toast.className =
        `mm-toast mm-toast-${type}`;

    toast.textContent =
        message;


    container.appendChild(
        toast
    );


    setTimeout(
        () => {

            toast.classList.add(
                "hide"
            );

            setTimeout(
                () => toast.remove(),
                300
            );

        },
        3000
    );
}


/* =========================================================
   CATEGORIES
   ========================================================= */

function getCategoryName(id) {

    const category =
        categories.find(
            item =>
                item.id === id
        );

    return category
        ? category.name
        : "بدون دسته‌بندی";
}


function renderCategorySelect() {

    const select =
        document.getElementById(
            "productCategory"
        );

    if (!select) return;


    const current =
        select.value;


    select.innerHTML =
        `
        <option value="">
            بدون دسته‌بندی
        </option>
        `;


    categories.forEach(
        category => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                category.id;

            option.textContent =
                category.name;

            select.appendChild(
                option
            );
        }
    );


    select.value =
        current;
}


function renderCategoryFilter() {

    const select =
        document.getElementById(
            "categoryFilter"
        );

    if (!select) return;


    const current =
        select.value;


    select.innerHTML =
        `
        <option value="">
            همه دسته‌بندی‌ها
        </option>
        `;


    categories.forEach(
        category => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                category.id;

            option.textContent =
                category.name;

            select.appendChild(
                option
            );
        }
    );


    select.value =
        current;
}


function openCategoryModal() {

    const modal =
        document.getElementById(
            "categoryModal"
        );

    const form =
        document.getElementById(
            "categoryForm"
        );

    if (form) {
        form.reset();
    }

    if (modal) {
        modal.classList.add(
            "active"
        );
    }
}


function saveCategory(event) {

    event.preventDefault();


    const input =
        document.getElementById(
            "categoryName"
        );


    const name =
        input
            ? input.value.trim()
            : "";


    if (!name) {

        showToast(
            "نام دسته‌بندی را وارد کنید.",
            "error"
        );

        return;
    }


    const exists =
        categories.some(
            category =>
                category.name
                    .trim()
                    .toLowerCase() ===
                name
                    .trim()
                    .toLowerCase()
        );


    if (exists) {

        showToast(
            "این دسته‌بندی قبلاً وجود دارد.",
            "warning"
        );

        return;
    }


    categories.push({
        id:
            generateId("category"),

        name
    });


    if (!saveAll()) {
        return;
    }


    closeModalById(
        "categoryModal"
    );

    renderAll();


    showToast(
        "دسته‌بندی ذخیره شد."
    );
}


/* =========================================================
   PRODUCTS
   ========================================================= */

function openProductModal(product = null) {

    const modal =
        document.getElementById(
            "productModal"
        );

    const form =
        document.getElementById(
            "productForm"
        );

    const title =
        document.getElementById(
            "productModalTitle"
        );


    if (!modal || !form) {
        return;
    }


    currentEditingProductId =
        product
            ? product.id
            : null;


    form.reset();


    if (title) {

        title.textContent =
            product
                ? "ویرایش محصول"
                : "افزودن محصول";
    }


    const idInput =
        document.getElementById(
            "productId"
        );

    if (idInput) {

        idInput.value =
            product
                ? product.id
                : "";
    }


    const fields = {

        productName:
            product?.name || "",

        productCategory:
            product?.category || "",

        purchasePrice:
            product?.purchasePrice || "",

        salePrice:
            product?.salePrice || "",

        productStock:
            product?.stock || "",

        productCode:
            product?.code || "",

        productDescription:
            product?.description || ""
    };


    Object.entries(fields)
        .forEach(
            ([id, value]) => {

                const element =
                    document.getElementById(
                        id
                    );

                if (element) {

                    element.value =
                        value;
                }
            }
        );


    const imageInput =
        document.getElementById(
            "productImage"
        );


    if (imageInput) {

        delete imageInput.dataset.image;

        if (product?.image) {

            imageInput.dataset.image =
                product.image;
        }
    }


    renderImagePreview(
        product?.image || ""
    );


    modal.classList.add(
        "active"
    );
}


function saveProduct(event) {

    event.preventDefault();


    const name =
        document
            .getElementById(
                "productName"
            )
            ?.value
            .trim();


    if (!name) {

        showToast(
            "نام محصول را وارد کنید.",
            "error"
        );

        return;
    }


    const imageInput =
        document.getElementById(
            "productImage"
        );


    const data = {

        name,

        category:
            document
                .getElementById(
                    "productCategory"
                )
                ?.value || "",

        purchasePrice:
            number(
                document
                    .getElementById(
                        "purchasePrice"
                    )
                    ?.value
            ),

        salePrice:
            number(
                document
                    .getElementById(
                        "salePrice"
                    )
                    ?.value
            ),

        stock:
            number(
                document
                    .getElementById(
                        "productStock"
                    )
                    ?.value
            ),

        code:
            document
                .getElementById(
                    "productCode"
                )
                ?.value
                .trim() || "",

        description:
            document
                .getElementById(
                    "productDescription"
                )
                ?.value
                .trim() || "",

        image:
            imageInput?.dataset.image || ""
    };


    if (currentEditingProductId) {

        const index =
            products.findIndex(
                product =>
                    product.id ===
                    currentEditingProductId
            );


        if (index !== -1) {

            products[index] = {

                ...products[index],

                ...data,

                updatedAt:
                    new Date()
                        .toISOString()
            };
        }

    } else {

        products.push({

            id:
                generateId("product"),

            ...data,

            createdAt:
                new Date()
                    .toISOString(),

            updatedAt:
                new Date()
                    .toISOString()
        });
    }


    if (!saveAll()) {
        return;
    }


    closeModalById(
        "productModal"
    );


    currentEditingProductId =
        null;


    renderAll();


    showToast(
        "محصول با موفقیت ذخیره شد."
    );
}


function editProduct(id) {

    const product =
        products.find(
            item =>
                item.id === id
        );


    if (!product) {

        showToast(
            "محصول پیدا نشد.",
            "error"
        );

        return;
    }


    openProductModal(
        product
    );
}


function deleteProduct(id) {

    const product =
        products.find(
            item =>
                item.id === id
        );


    if (!product) return;


    if (
        !confirm(
            `آیا محصول «${product.name}» حذف شود؟`
        )
    ) {
        return;
    }


    products =
        products.filter(
            item =>
                item.id !== id
        );


    cart =
        cart.filter(
            item =>
                item.productId !== id
        );


    if (!saveAll()) {
        return;
    }


    renderAll();


    showToast(
        "محصول حذف شد."
    );
}


/* =========================================================
   IMAGE
   ========================================================= */

function handleImageUpload(event) {

    const file =
        event.target.files?.[0];


    if (!file) return;


    if (
        !file.type.startsWith(
            "image/"
        )
    ) {

        showToast(
            "فقط فایل تصویری انتخاب کنید.",
            "error"
        );

        return;
    }


    if (
        file.size >
        2.5 * 1024 * 1024
    ) {

        showToast(
            "حجم تصویر حداکثر ۲.۵ مگابایت باشد.",
            "error"
        );

        event.target.value =
            "";

        return;
    }


    const reader =
        new FileReader();


    reader.onload =
        function () {

            event.target.dataset.image =
                reader.result;

            renderImagePreview(
                reader.result
            );
        };


    reader.readAsDataURL(
        file
    );
}


function renderImagePreview(image) {

    const preview =
        document.getElementById(
            "imagePreview"
        );


    if (!preview) return;


    if (image) {

        preview.innerHTML =
            `
            <img
                src="${escapeHTML(image)}"
                alt="پیش‌نمایش"
            >
            `;

    } else {

        preview.innerHTML =
            `
            <span>
                تصویر محصول
            </span>
            `;
    }
}


function removeImage() {

    const input =
        document.getElementById(
            "productImage"
        );


    if (input) {

        input.value =
            "";

        delete input.dataset.image;
    }


    renderImagePreview(
        ""
    );
}


/* =========================================================
   PRODUCTS RENDER
   ========================================================= */

function renderProducts() {

    const grid =
        document.getElementById(
            "productsGrid"
        );

    const empty =
        document.getElementById(
            "emptyState"
        );


    if (!grid) return;


    let list =
        [...products];


    const search =
        document
            .getElementById(
                "searchInput"
            )
            ?.value
            .trim()
            .toLowerCase() || "";


    const category =
        document
            .getElementById(
                "categoryFilter"
            )
            ?.value || "";


    const stockFilter =
        document
            .getElementById(
                "stockFilter"
            )
            ?.value || "";


    const sort =
        document
            .getElementById(
                "sortFilter"
            )
            ?.value || "";


    if (search) {

        list =
            list.filter(
                product => {

                    const text =
                        [
                            product.name,
                            product.code,
                            product.description,
                            getCategoryName(
                                product.category
                            )
                        ]
                            .join(" ")
                            .toLowerCase();

                    return text.includes(
                        search
                    );
                }
            );
    }


    if (category) {

        list =
            list.filter(
                product =>
                    product.category ===
                    category
            );
    }


    if (
        stockFilter ===
        "available"
    ) {

        list =
            list.filter(
                product =>
                    number(
                        product.stock
                    ) > 0
            );
    }


    if (
        stockFilter ===
        "out"
    ) {

        list =
            list.filter(
                product =>
                    number(
                        product.stock
                    ) <= 0
            );
    }


    if (
        stockFilter ===
        "low"
    ) {

        list =
            list.filter(
                product =>
                    number(
                        product.stock
                    ) > 0 &&
                    number(
                        product.stock
                    ) <= 5
            );
    }


    switch (sort) {

        case "name":

            list.sort(
                (a, b) =>
                    a.name.localeCompare(
                        b.name,
                        "fa"
                    )
            );

            break;


        case "price-low":

            list.sort(
                (a, b) =>
                    number(
                        a.salePrice
                    ) -
                    number(
                        b.salePrice
                    )
            );

            break;


        case "price-high":

            list.sort(
                (a, b) =>
                    number(
                        b.salePrice
                    ) -
                    number(
                        a.salePrice
                    )
            );

            break;


        case "stock-high":

            list.sort(
                (a, b) =>
                    number(
                        b.stock
                    ) -
                    number(
                        a.stock
                    )
            );

            break;


        case "newest":

            list.sort(
                (a, b) =>
                    new Date(
                        b.createdAt
                    ) -
                    new Date(
                        a.createdAt
                    )
            );

            break;
    }


    grid.innerHTML =
        "";


    if (
        list.length === 0
    ) {

        if (empty) {

            empty.style.display =
                "block";
        }

        return;
    }


    if (empty) {

        empty.style.display =
            "none";
    }


    list.forEach(
        product => {

            grid.appendChild(
                createProductCard(
                    product
                )
            );
        }
    );
}


function createProductCard(
    product
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "product-card";


    const stock =
        number(
            product.stock
        );


    let stockClass =
        "available";

    let stockText =
        `موجودی: ${formatNumber(stock)}`;


    if (stock <= 0) {

        stockClass =
            "out";

        stockText =
            "ناموجود";

    } else if (stock <= 5) {

        stockClass =
            "low";

        stockText =
            `موجودی کم: ${formatNumber(stock)}`;
    }


    card.innerHTML =
        `
        <div class="product-image">

            ${
                product.image
                    ? `
                    <img
                        src="${escapeHTML(
                            product.image
                        )}"
                        alt="${escapeHTML(
                            product.name
                        )}"
                    >
                    `
                    : `
                    <div class="no-image">
                        📦
                    </div>
                    `
            }

            <span
                class="stock-badge ${stockClass}"
            >
                ${escapeHTML(
                    stockText
                )}
            </span>

        </div>


        <div class="product-card-body">

            <div class="product-category">
                ${escapeHTML(
                    getCategoryName(
                        product.category
                    )
                )}
            </div>


            <h3>
                ${escapeHTML(
                    product.name
                )}
            </h3>


            ${
                product.code
                    ? `
                    <div class="product-code">
                        کد:
                        ${escapeHTML(
                            product.code
                        )}
                    </div>
                    `
                    : ""
            }


            <div class="product-price">
                ${formatNumber(
                    product.salePrice
                )}
                تومان
            </div>


            <div class="product-actions">

                <button
                    type="button"
                    class="secondary-button"
                    onclick="editProduct('${escapeJS(
                        product.id
                    )}')"
                >
                    ویرایش
                </button>


                <button
                    type="button"
                    class="primary-button"
                    onclick="addToCart('${escapeJS(
                        product.id
                    )}')"
                >
                    افزودن
                </button>


                <button
                    type="button"
                    class="danger-button"
                    onclick="deleteProduct('${escapeJS(
                        product.id
                    )}')"
                >
                    حذف
                </button>

            </div>

        </div>
        `;


    return card;
}


/* =========================================================
   STATS
   ========================================================= */

function renderStats() {

    const totalProducts =
        document.getElementById(
            "totalProducts"
        );

    const totalStock =
        document.getElementById(
            "totalStock"
        );

    const inventoryValue =
        document.getElementById(
            "inventoryValue"
        );

    const cartItemsStat =
        document.getElementById(
            "cartItemsStat"
        );


    const stock =
        products.reduce(
            (
                sum,
                product
            ) =>
                sum +
                number(
                    product.stock
                ),
            0
        );


    const inventory =
        products.reduce(
            (
                sum,
                product
            ) =>
                sum +
                number(
                    product.purchasePrice
                ) *
                number(
                    product.stock
                ),
            0
        );


    const cartCount =
        cart.reduce(
            (
                sum,
                item
            ) =>
                sum +
                number(
                    item.quantity
                ),
            0
        );


    if (totalProducts) {

        totalProducts.textContent =
            formatNumber(
                products.length
            );
    }


    if (totalStock) {

        totalStock.textContent =
            formatNumber(
                stock
            );
    }


    if (inventoryValue) {

        inventoryValue.textContent =
            formatNumber(
                inventory
            );
    }


    if (cartItemsStat) {

        cartItemsStat.textContent =
            formatNumber(
                cartCount
            );
    }
}


/* =========================================================
   CART
   ========================================================= */

function addToCart(productId) {

    const product =
        products.find(
            item =>
                item.id ===
                productId
        );


    if (!product) return;


    if (
        number(
            product.stock
        ) <= 0
    ) {

        showToast(
            "این محصول موجود نیست.",
            "warning"
        );

        return;
    }


    const item =
        cart.find(
            cartItem =>
                cartItem.productId ===
                productId
        );


    if (item) {

        if (
            item.quantity >=
            number(
                product.stock
            )
        ) {

            showToast(
                "تعداد بیشتر از موجودی است.",
                "warning"
            );

            return;
        }


        item.quantity++;

    } else {

        cart.push({

            productId,

            quantity: 1
        });
    }


    saveAll();

    renderCartCount();
    renderStats();


    showToast(
        "به سبد خرید اضافه شد."
    );
}


function removeFromCart(
    productId
) {

    cart =
        cart.filter(
            item =>
                item.productId !==
                productId
        );


    saveAll();

    renderCart();

    renderCartCount();

    renderStats();
}


function changeCartQuantity(
    productId,
    change
) {

    const item =
        cart.find(
            cartItem =>
                cartItem.productId ===
                productId
        );


    const product =
        products.find(
            productItem =>
                productItem.id ===
                productId
        );


    if (!item || !product) {
        return;
    }


    const newQuantity =
        item.quantity +
        number(change);


    if (newQuantity <= 0) {

        removeFromCart(
            productId
        );

        return;
    }


    if (
        newQuantity >
        number(
            product.stock
        )
    ) {

        showToast(
            "بیشتر از موجودی نمی‌توانید انتخاب کنید.",
            "warning"
        );

        return;
    }


    item.quantity =
        newQuantity;


    saveAll();

    renderCart();

    renderCartCount();

    renderStats();
}


function renderCartCount() {

    const element =
        document.getElementById(
            "cartCount"
        );


    if (!element) return;


    const count =
        cart.reduce(
            (
                sum,
                item
            ) =>
                sum +
                number(
                    item.quantity
                ),
            0
        );


    element.textContent =
        formatNumber(count);
}


function calculateCart() {

    let subtotal = 0;


    cart.forEach(
        item => {

            const product =
                products.find(
                    p =>
                        p.id ===
                        item.productId
                );


            if (!product) return;


            subtotal +=
                number(
                    product.salePrice
                ) *
                number(
                    item.quantity
                );
        }
    );


    const discountInput =
        document.getElementById(
            "discountInput"
        );


    const taxInput =
        document.getElementById(
            "taxInput"
        );


    const discountType =
        document.querySelector(
            ".discount-type"
        );


    const taxType =
        document.querySelector(
            ".tax-type"
        );


    const discountNumber =
        number(
            discountInput?.value
        );


    const taxNumber =
        number(
            taxInput?.value
        );


    let discount;


    if (
        discountType?.value ===
        "percent"
    ) {

        discount =
            subtotal *
            discountNumber /
            100;

    } else {

        discount =
            discountNumber;
    }


    discount =
        Math.min(
            discount,
            subtotal
        );


    const afterDiscount =
        Math.max(
            0,
            subtotal - discount
        );


    let tax;


    if (
        taxType?.value ===
        "percent"
    ) {

        tax =
            afterDiscount *
            taxNumber /
            100;

    } else {

        tax =
            taxNumber;
    }


    return {

        subtotal,

        discount,

        tax,

        total:
            afterDiscount +
            tax
    };
}


function renderCart() {

    const container =
        document.getElementById(
            "cartContent"
        );


    if (!container) return;


    if (
        cart.length === 0
    ) {

        container.innerHTML =
            `
            <div class="cart-empty">

                <div class="cart-empty-icon">
                    🛒
                </div>

                <h3>
                    سبد خرید خالی است
                </h3>

                <p>
                    محصولی برای نمایش وجود ندارد.
                </p>

            </div>
            `;

        updateCartTotals();

        return;
    }


    container.innerHTML =
        cart
            .map(
                item => {

                    const product =
                        products.find(
                            p =>
                                p.id ===
                                item.productId
                        );


                    if (!product) {
                        return "";
                    }


                    const total =
                        number(
                            product.salePrice
                        ) *
                        number(
                            item.quantity
                        );


                    return `
                    <div class="cart-item">

                        <div class="cart-item-image">

                            ${
                                product.image
                                    ? `
                                    <img
                                        src="${escapeHTML(
                                            product.image
                                        )}"
                                        alt=""
                                    >
                                    `
                                    : "📦"
                            }

                        </div>


                        <div class="cart-item-info">

                            <h4>
                                ${escapeHTML(
                                    product.name
                                )}
                            </h4>

                            <span>
                                ${formatNumber(
                                    product.salePrice
                                )}
                                تومان
                            </span>

                        </div>


                        <div class="cart-item-quantity">

                            <button
                                type="button"
                                onclick="changeCartQuantity(
                                    '${escapeJS(
                                        product.id
                                    )}',
                                    1
                                )"
                            >
                                +
                            </button>

                            <span>
                                ${formatNumber(
                                    item.quantity
                                )}
                            </span>

                            <button
                                type="button"
                                onclick="changeCartQuantity(
                                    '${escapeJS(
                                        product.id
                                    )}',
                                    -1
                                )"
                            >
                                −
                            </button>

                        </div>


                        <strong>
                            ${formatNumber(
                                total
                            )}
                            تومان
                        </strong>


                        <button
                            type="button"
                            class="danger-button"
                            onclick="removeFromCart(
                                '${escapeJS(
                                    product.id
                                )}'
                            )"
                        >
                            حذف
                        </button>

                    </div>
                    `;
                }
            )
            .join("");


    updateCartTotals();
}


function updateCartTotals() {

    const result =
        calculateCart();


    const subtotal =
        document.getElementById(
            "cartSubtotal"
        );

    const discount =
        document.getElementById(
            "discountValue"
        );

    const tax =
        document.getElementById(
            "taxValue"
        );

    const total =
        document.getElementById(
            "cartTotal"
        );


    if (subtotal) {

        subtotal.textContent =
            formatNumber(
                result.subtotal
            );
    }


    if (discount) {

        discount.textContent =
            formatNumber(
                result.discount
            );
    }


    if (tax) {

        tax.textContent =
            formatNumber(
                result.tax
            );
    }


    if (total) {

        total.textContent =
            formatNumber(
                result.total
            );
    }
}


function openCart() {

    const overlay =
        document.getElementById(
            "cartOverlay"
        );


    if (!overlay) return;


    overlay.classList.add(
        "active"
    );


    renderCart();
}


function closeCart() {

    const overlay =
        document.getElementById(
            "cartOverlay"
        );


    if (overlay) {

        overlay.classList.remove(
            "active"
        );
    }
}


function clearCart() {

    if (
        cart.length === 0
    ) {
        return;
    }


    if (
        !confirm(
            "سبد خرید کاملاً خالی شود؟"
        )
    ) {
        return;
    }


    cart = [];


    saveAll();

    renderCart();

    renderCartCount();

    renderStats();


    showToast(
        "سبد خرید خالی شد."
    );
}


/* =========================================================
   INVOICES
   ========================================================= */

function generateInvoiceNumber() {

    const year =
        new Date()
            .getFullYear();


    const numbers =
        invoices
            .map(
                invoice =>
                    String(
                        invoice.number || ""
                    )
            )
            .map(
                value => {

                    const match =
                        value.match(
                            /(\d+)$/
                        );

                    return match
                        ? number(
                            match[1]
                        )
                        : 0;
                }
            );


    const max =
        numbers.length
            ? Math.max(...numbers)
            : 0;


    return (
        year +
        "-" +
        String(
            max + 1
        ).padStart(
            5,
            "0"
        )
    );
}


function checkout() {

    if (
        cart.length === 0
    ) {

        showToast(
            "سبد خرید خالی است.",
            "warning"
        );

        return;
    }


    const calculation =
        calculateCart();


    const customerName =
        prompt(
            "نام مشتری:",
            ""
        );


    if (
        customerName === null
    ) {
        return;
    }


    const customerPhone =
        prompt(
            "شماره تماس مشتری:",
            ""
        );


    if (
        customerPhone === null
    ) {
        return;
    }


    const items =
        cart
            .map(
                cartItem => {

                    const product =
                        products.find(
                            p =>
                                p.id ===
                                cartItem.productId
                        );


                    if (!product) {
                        return null;
                    }


                    return {

                        productId:
                            product.id,

                        name:
                            product.name,

                        code:
                            product.code,

                        quantity:
                            number(
                                cartItem.quantity
                            ),

                        price:
                            number(
                                product.salePrice
                            ),

                        total:
                            number(
                                product.salePrice
                            ) *
                            number(
                                cartItem.quantity
                            )
                    };
                }
            )
            .filter(Boolean);


    /*
        کم کردن موجودی
    */

    items.forEach(
        item => {

            const product =
                products.find(
                    p =>
                        p.id ===
                        item.productId
                );


            if (product) {

                product.stock =
                    Math.max(
                        0,
                        number(
                            product.stock
                        ) -
                        number(
                            item.quantity
                        )
                    );
            }
        }
    );


    const invoice = {

        id:
            generateId(
                "invoice"
            ),

        number:
            generateInvoiceNumber(),

        date:
            new Date()
                .toISOString(),

        customer: {

            name:
                customerName.trim(),

            phone:
                customerPhone.trim(),

            address:
                ""
        },

        items,

        subtotal:
            calculation.subtotal,

        discount:
            calculation.discount,

        tax:
            calculation.tax,

        total:
            calculation.total,

        status:
            "completed"
    };


    invoices.unshift(
        invoice
    );


    cart = [];


    if (!saveAll()) {
        return;
    }


    renderAll();


    closeCart();


    showToast(
        `فاکتور ${invoice.number} ثبت شد.`
    );


    setTimeout(
        () =>
            viewInvoice(
                invoice.id
            ),
        200
    );
}


/* =========================================================
   INVOICE HISTORY MODAL
   ========================================================= */

function createInvoiceHistoryButton() {

    if (
        document.getElementById(
            "invoiceHistoryButton"
        )
    ) {
        return;
    }


    const button =
        document.createElement(
            "button"
        );


    button.id =
        "invoiceHistoryButton";

    button.type =
        "button";

    button.className =
        "secondary-button header-extra-button";

    button.innerHTML =
        `
        <span>🧾</span>
        فاکتورها
        `;


    button.addEventListener(
        "click",
        openInvoiceHistory
    );


    const target =
        document.querySelector(
            ".top-actions"
        );


    if (target) {

        target.appendChild(
            button
        );
    }
}


function openInvoiceHistory() {

    let modal =
        document.getElementById(
            "invoiceHistoryModal"
        );


    if (!modal) {

        modal =
            document.createElement(
                "div"
            );

        modal.id =
            "invoiceHistoryModal";

        modal.className =
            "modal dynamic-modal";


        modal.innerHTML =
            `
            <div
                class="modal-box invoice-history-modal"
            >

                <div class="modal-header">

                    <div>
                        <span class="modal-eyebrow">
                            مدیریت مالی
                        </span>

                        <h2>
                            تاریخچه فاکتورها
                        </h2>
                    </div>


                    <button
                        type="button"
                        class="modal-close"
                        data-history-close
                    >
                        ×
                    </button>

                </div>


                <div
                    id="invoiceHistoryContent"
                ></div>

            </div>
            `;


        document.body.appendChild(
            modal
        );


        modal
            .querySelector(
                "[data-history-close]"
            )
            .addEventListener(
                "click",
                () =>
                    modal.classList.remove(
                        "active"
                    )
            );


        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    modal
                ) {

                    modal.classList.remove(
                        "active"
                    );
                }
            }
        );
    }


    renderInvoiceHistory();


    modal.classList.add(
        "active"
    );
}


function renderInvoiceHistory() {

    const container =
        document.getElementById(
            "invoiceHistoryContent"
        );


    if (!container) return;


    if (
        invoices.length === 0
    ) {

        container.innerHTML =
            `
            <div class="invoice-empty-state">

                <div class="invoice-empty-icon">
                    🧾
                </div>

                <h3>
                    هنوز فاکتوری ثبت نشده است
                </h3>

                <p>
                    فاکتورهای فروش شما در این قسمت نمایش داده می‌شوند.
                </p>

            </div>
            `;

        return;
    }


    container.innerHTML =
        `
        <div class="invoice-history-toolbar">

            <div>

                <strong>
                    ${formatNumber(
                        invoices.length
                    )}
                    فاکتور
                </strong>

                <span>
                    تمام فاکتورهای ثبت شده
                </span>

            </div>


            <button
                type="button"
                class="danger-button danger-large"
                onclick="deleteAllInvoices()"
            >
                🗑️ حذف تمام فاکتورها
            </button>

        </div>


        <div class="invoice-list">

            ${
                invoices
                    .map(
                        invoice => {

                            const itemCount =
                                invoice.items
                                    ?.reduce(
                                        (
                                            sum,
                                            item
                                        ) =>
                                            sum +
                                            number(
                                                item.quantity
                                            ),
                                        0
                                    ) || 0;


                            const date =
                                new Date(
                                    invoice.date
                                )
                                    .toLocaleString(
                                        "fa-IR"
                                    );


                            const cancelled =
                                invoice.status ===
                                "cancelled";


                            return `
                            <div
                                class="
                                    invoice-history-card
                                    ${
                                        cancelled
                                            ? "cancelled"
                                            : ""
                                    }
                                "
                            >

                                <div
                                    class="invoice-card-main"
                                >

                                    <div
                                        class="invoice-number-box"
                                    >
                                        <span>
                                            فاکتور
                                        </span>

                                        <strong>
                                            ${escapeHTML(
                                                invoice.number
                                            )}
                                        </strong>
                                    </div>


                                    <div
                                        class="invoice-card-info"
                                    >

                                        <h3>
                                            ${
                                                escapeHTML(
                                                    invoice.customer?.name ||
                                                    "مشتری ثبت نشده"
                                                )
                                            }
                                        </h3>

                                        <div
                                            class="invoice-meta-line"
                                        >
                                            <span>
                                                📅
                                                ${escapeHTML(
                                                    date
                                                )}
                                            </span>

                                            <span>
                                                📦
                                                ${formatNumber(
                                                    itemCount
                                                )}
                                                کالا
                                            </span>

                                            ${
                                                invoice.customer?.phone
                                                    ? `
                                                    <span>
                                                        ☎️
                                                        ${escapeHTML(
                                                            invoice.customer.phone
                                                        )}
                                                    </span>
                                                    `
                                                    : ""
                                            }

                                        </div>

                                    </div>


                                    <div
                                        class="invoice-card-total"
                                    >

                                        <span>
                                            مبلغ نهایی
                                        </span>

                                        <strong>
                                            ${formatNumber(
                                                invoice.total
                                            )}
                                            تومان
                                        </strong>

                                    </div>

                                </div>


                                <div
                                    class="invoice-card-actions"
                                >

                                    ${
                                        cancelled
                                            ? `
                                            <span
                                                class="invoice-status cancelled"
                                            >
                                                لغو شده
                                            </span>
                                            `
                                            : `
                                            <span
                                                class="invoice-status completed"
                                            >
                                                تکمیل شده
                                            </span>
                                            `
                                    }


                                    <button
                                        type="button"
                                        class="secondary-button"
                                        onclick="viewInvoice('${escapeJS(
                                            invoice.id
                                        )}')"
                                    >
                                        👁️ مشاهده
                                    </button>


                                    ${
                                        !cancelled
                                            ? `
                                            <button
                                                type="button"
                                                class="warning-button"
                                                onclick="cancelInvoice('${escapeJS(
                                                    invoice.id
                                                )}')"
                                            >
                                                ↩️ لغو
                                            </button>
                                            `
                                            : ""
                                    }


                                    <button
                                        type="button"
                                        class="danger-button"
                                        onclick="deleteInvoice('${escapeJS(
                                            invoice.id
                                        )}')"
                                    >
                                        🗑️ حذف
                                    </button>

                                </div>

                            </div>
                            `;
                        }
                    )
                    .join("")
            }

        </div>
        `;
}


/* =========================================================
   DELETE ONE INVOICE
   ========================================================= */

function deleteInvoice(id) {

    const index =
        invoices.findIndex(
            invoice =>
                invoice.id === id
        );


    if (index === -1) {

        showToast(
            "فاکتور پیدا نشد.",
            "error"
        );

        return;
    }


    const invoice =
        invoices[index];


    if (
        !confirm(
            `فاکتور ${invoice.number} حذف شود؟`
        )
    ) {
        return;
    }


    invoices.splice(
        index,
        1
    );


    if (!saveAll()) {
        return;
    }


    renderInvoiceHistory();


    showToast(
        "فاکتور حذف شد."
    );
}


/* =========================================================
   DELETE ALL INVOICES
   ========================================================= */

function deleteAllInvoices() {

    if (
        invoices.length === 0
    ) {

        showToast(
            "فاکتوری برای حذف وجود ندارد.",
            "warning"
        );

        return;
    }


    const confirmed =
        confirm(
            `آیا مطمئن هستید که می‌خواهید تمام ${formatNumber(
                invoices.length
            )} فاکتور حذف شود؟\n\nاین عملیات قابل بازگشت نیست.`
        );


    if (!confirmed) {
        return;
    }


    const secondConfirm =
        confirm(
            "تأیید نهایی: تمام فاکتورها برای همیشه حذف شوند؟"
        );


    if (!secondConfirm) {
        return;
    }


    invoices = [];


    if (!saveAll()) {
        return;
    }


    renderInvoiceHistory();


    showToast(
        "تمام فاکتورها حذف شدند."
    );
}


/* =========================================================
   CANCEL INVOICE
   ========================================================= */

function cancelInvoice(id) {

    const invoice =
        invoices.find(
            item =>
                item.id === id
        );


    if (!invoice) return;


    if (
        invoice.status ===
        "cancelled"
    ) {

        showToast(
            "این فاکتور قبلاً لغو شده است.",
            "warning"
        );

        return;
    }


    if (
        !confirm(
            `فاکتور ${invoice.number} لغو شود؟ موجودی کالاها برگردانده خواهد شد.`
        )
    ) {
        return;
    }


    invoice.items.forEach(
        item => {

            const product =
                products.find(
                    p =>
                        p.id ===
                        item.productId
                );


            if (product) {

                product.stock =
                    number(
                        product.stock
                    ) +
                    number(
                        item.quantity
                    );
            }
        }
    );


    invoice.status =
        "cancelled";


    if (!saveAll()) {
        return;
    }


    renderAll();


    renderInvoiceHistory();


    showToast(
        "فاکتور لغو شد و موجودی برگشت خورد."
    );
}


/* =========================================================
   VIEW INVOICE
   ========================================================= */

function viewInvoice(id) {

    const invoice =
        invoices.find(
            item =>
                item.id === id
        );


    if (!invoice) {
        return;
    }


    let modal =
        document.getElementById(
            "invoiceViewModal"
        );


    if (!modal) {

        modal =
            document.createElement(
                "div"
            );

        modal.id =
            "invoiceViewModal";

        modal.className =
            "modal dynamic-modal";


        modal.innerHTML =
            `
            <div
                class="modal-box invoice-view-modal"
            >

                <div class="modal-header">

                    <div>

                        <span class="modal-eyebrow">
                            جزئیات فروش
                        </span>

                        <h2>
                            مشاهده فاکتور
                        </h2>

                    </div>


                    <button
                        type="button"
                        class="modal-close"
                        data-invoice-view-close
                    >
                        ×
                    </button>

                </div>


                <div
                    id="invoiceViewContent"
                ></div>

            </div>
            `;


        document.body.appendChild(
            modal
        );


        modal
            .querySelector(
                "[data-invoice-view-close]"
            )
            .addEventListener(
                "click",
                () =>
                    modal.classList.remove(
                        "active"
                    )
            );
    }


    const container =
        document.getElementById(
            "invoiceViewContent"
        );


    const date =
        new Date(
            invoice.date
        )
            .toLocaleString(
                "fa-IR"
            );


    container.innerHTML =
        `
        <div class="invoice-document">

            <div class="invoice-document-head">

                <div>

                    ${
                        storeSettings.logo
                            ? `
                            <img
                                src="${escapeHTML(
                                    storeSettings.logo
                                )}"
                                class="invoice-logo"
                                alt="لوگو"
                            >
                            `
                            : `
                            <div class="invoice-logo-placeholder">
                                ${escapeHTML(
                                    storeSettings.storeName
                                )}
                            </div>
                            `
                    }

                </div>


                <div>

                    <h1>
                        ${escapeHTML(
                            storeSettings.storeName
                        )}
                    </h1>

                    ${
                        storeSettings.phone
                            ? `
                            <p>
                                تلفن:
                                ${escapeHTML(
                                    storeSettings.phone
                                )}
                            </p>
                            `
                            : ""
                    }

                    ${
                        storeSettings.address
                            ? `
                            <p>
                                ${escapeHTML(
                                    storeSettings.address
                                )}
                            </p>
                            `
                            : ""
                    }

                </div>


                <div
                    class="invoice-document-number"
                >

                    <span>
                        شماره فاکتور
                    </span>

                    <strong>
                        ${escapeHTML(
                            invoice.number
                        )}
                    </strong>

                    <small>
                        ${escapeHTML(
                            date
                        )}
                    </small>

                </div>

            </div>


            <div class="invoice-customer-box">

                <div>

                    <span>
                        مشتری
                    </span>

                    <strong>
                        ${escapeHTML(
                            invoice.customer?.name ||
                            "-"
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        شماره تماس
                    </span>

                    <strong>
                        ${escapeHTML(
                            invoice.customer?.phone ||
                            "-"
                        )}
                    </strong>

                </div>

            </div>


            <div class="invoice-table-wrapper">

                <table
                    class="invoice-table"
                >

                    <thead>

                        <tr>

                            <th>
                                #
                            </th>

                            <th>
                                محصول
                            </th>

                            <th>
                                کد
                            </th>

                            <th>
                                تعداد
                            </th>

                            <th>
                                قیمت واحد
                            </th>

                            <th>
                                مبلغ
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        ${
                            invoice.items
                                .map(
                                    (
                                        item,
                                        index
                                    ) =>
                                        `
                                        <tr>

                                            <td>
                                                ${formatNumber(
                                                    index + 1
                                                )}
                                            </td>

                                            <td>
                                                ${escapeHTML(
                                                    item.name
                                                )}
                                            </td>

                                            <td>
                                                ${escapeHTML(
                                                    item.code ||
                                                    "-"
                                                )}
                                            </td>

                                            <td>
                                                ${formatNumber(
                                                    item.quantity
                                                )}
                                            </td>

                                            <td>
                                                ${formatNumber(
                                                    item.price
                                                )}
                                            </td>

                                            <td>
                                                ${formatNumber(
                                                    item.total
                                                )}
                                            </td>

                                        </tr>
                                        `
                                )
                                .join("")
                        }

                    </tbody>

                </table>

            </div>


            <div class="invoice-bottom">

                <div
                    class="invoice-note"
                >

                    ${
                        storeSettings.description
                            ? `
                            <strong>
                                توضیحات
                            </strong>

                            <p>
                                ${escapeHTML(
                                    storeSettings.description
                                )}
                            </p>
                            `
                            : ""
                    }

                </div>


                <div
                    class="invoice-total-box"
                >

                    <div>

                        <span>
                            جمع کالاها
                        </span>

                        <strong>
                            ${formatNumber(
                                invoice.subtotal
                            )}
                            تومان
                        </strong>

                    </div>


                    <div>

                        <span>
                            تخفیف
                        </span>

                        <strong>
                            ${formatNumber(
                                invoice.discount
                            )}
                            تومان
                        </strong>

                    </div>


                    <div>

                        <span>
                            مالیات
                        </span>

                        <strong>
                            ${formatNumber(
                                invoice.tax
                            )}
                            تومان
                        </strong>

                    </div>


                    <div
                        class="invoice-final-total"
                    >

                        <span>
                            مبلغ نهایی
                        </span>

                        <strong>
                            ${formatNumber(
                                invoice.total
                            )}
                            تومان
                        </strong>

                    </div>

                </div>

            </div>


            <div class="invoice-document-actions">

                <button
                    type="button"
                    class="primary-button"
                    onclick="printInvoice('${escapeJS(
                        invoice.id
                    )}')"
                >
                    🖨️ چاپ فاکتور
                </button>


                <button
                    type="button"
                    class="danger-button"
                    onclick="deleteInvoice('${escapeJS(
                        invoice.id
                    )}')"
                >
                    🗑️ حذف فاکتور
                </button>

            </div>

        </div>
        `;


    modal.classList.add(
        "active"
    );
}


/* =========================================================
   PRINT
   ========================================================= */

function printInvoice(id) {

    const invoice =
        invoices.find(
            item =>
                item.id === id
        );


    if (!invoice) return;


    const date =
        new Date(
            invoice.date
        )
            .toLocaleString(
                "fa-IR"
            );


    const printWindow =
        window.open(
            "",
            "_blank"
        );


    if (!printWindow) {

        showToast(
            "پنجره چاپ باز نشد.",
            "error"
        );

        return;
    }


    const rows =
        invoice.items
            .map(
                (
                    item,
                    index
                ) =>
                    `
                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            ${escapeHTML(
                                item.name
                            )}
                        </td>

                        <td>
                            ${number(
                                item.quantity
                            )}
                        </td>

                        <td>
                            ${formatNumber(
                                item.price
                            )}
                        </td>

                        <td>
                            ${formatNumber(
                                item.total
                            )}
                        </td>

                    </tr>
                    `
            )
            .join("");


    printWindow.document.write(
        `
        <!DOCTYPE html>

        <html
            lang="fa"
            dir="rtl"
        >

        <head>

            <meta charset="UTF-8">

            <title>
                فاکتور ${escapeHTML(
                    invoice.number
                )}
            </title>

            <style>

                * {
                    box-sizing: border-box;
                }

                body {
                    font-family:
                        Tahoma,
                        Arial,
                        sans-serif;

                    padding: 30px;

                    color: #111;

                    direction: rtl;
                }

                .head {
                    display: flex;
                    justify-content:
                        space-between;

                    align-items:
                        flex-start;

                    border-bottom:
                        2px solid #111;

                    padding-bottom: 20px;
                }

                h1, h2 {
                    margin:
                        0 0 10px;
                }

                table {
                    width: 100%;

                    border-collapse:
                        collapse;

                    margin-top: 30px;
                }

                th,
                td {
                    border:
                        1px solid #ddd;

                    padding:
                        10px;

                    text-align:
                        right;
                }

                th {
                    background:
                        #f5f5f5;
                }

                .customer {
                    margin-top:
                        20px;

                    padding:
                        15px;

                    background:
                        #f5f5f5;

                    border-radius:
                        10px;
                }

                .totals {
                    width:
                        350px;

                    margin-top:
                        30px;

                    margin-right:
                        auto;
                }

                .row {
                    display:
                        flex;

                    justify-content:
                        space-between;

                    padding:
                        8px 0;
                }

                .final {
                    border-top:
                        2px solid #111;

                    margin-top:
                        8px;

                    padding-top:
                        12px;

                    font-size:
                        18px;

                    font-weight:
                        bold;
                }

                @media print {

                    body {
                        padding:
                            10px;
                    }

                }

            </style>

        </head>


        <body>

            <div class="head">

                <div>

                    <h1>
                        ${escapeHTML(
                            storeSettings.storeName
                        )}
                    </h1>

                    ${
                        storeSettings.phone
                            ? `
                            <div>
                                تلفن:
                                ${escapeHTML(
                                    storeSettings.phone
                                )}
                            </div>
                            `
                            : ""
                    }

                </div>


                <div>

                    <strong>
                        فاکتور:
                        ${escapeHTML(
                            invoice.number
                        )}
                    </strong>

                    <div>
                        ${escapeHTML(
                            date
                        )}
                    </div>

                </div>

            </div>


            <div class="customer">

                مشتری:
                <strong>
                    ${escapeHTML(
                        invoice.customer?.name ||
                        "-"
                    )}
                </strong>

                <br>

                تماس:
                ${escapeHTML(
                    invoice.customer?.phone ||
                    "-"
                )}

            </div>


            <table>

                <thead>

                    <tr>

                        <th>
                            #
                        </th>

                        <th>
                            محصول
                        </th>

                        <th>
                            تعداد
                        </th>

                        <th>
                            قیمت
                        </th>

                        <th>
                            مبلغ
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${rows}

                </tbody>

            </table>


            <div class="totals">

                <div class="row">

                    <span>
                        جمع:
                    </span>

                    <strong>
                        ${formatNumber(
                            invoice.subtotal
                        )}
                        تومان
                    </strong>

                </div>


                <div class="row">

                    <span>
                        تخفیف:
                    </span>

                    <strong>
                        ${formatNumber(
                            invoice.discount
                        )}
                        تومان
                    </strong>

                </div>


                <div class="row">

                    <span>
                        مالیات:
                    </span>

                    <strong>
                        ${formatNumber(
                            invoice.tax
                        )}
                        تومان
                    </strong>

                </div>


                <div class="row final">

                    <span>
                        مبلغ نهایی:
                    </span>

                    <strong>
                        ${formatNumber(
                            invoice.total
                        )}
                        تومان
                    </strong>

                </div>

            </div>


            <script>

                window.onload = function() {
                    window.print();
                };

            <\/script>

        </body>

        </html>
        `
    );


    printWindow.document.close();
}


/* =========================================================
   STORE SETTINGS
   ========================================================= */

function createStoreSettingsButton() {

    if (
        document.getElementById(
            "storeSettingsButton"
        )
    ) {
        return;
    }


    const button =
        document.createElement(
            "button"
        );


    button.id =
        "storeSettingsButton";

    button.type =
        "button";

    button.className =
        "secondary-button header-extra-button";

    button.innerHTML =
        `
        <span>⚙️</span>
        تنظیمات
        `;


    button.addEventListener(
        "click",
        openStoreSettingsModal
    );


    const target =
        document.querySelector(
            ".top-actions"
        );


    if (target) {

        target.appendChild(
            button
        );
    }
}


function openStoreSettingsModal() {

    let modal =
        document.getElementById(
            "storeSettingsModal"
        );


    if (!modal) {

        modal =
            document.createElement(
                "div"
            );

        modal.id =
            "storeSettingsModal";

        modal.className =
            "modal dynamic-modal";


        modal.innerHTML =
            `
            <div
                class="modal-box settings-modal"
            >

                <div class="modal-header">

                    <div>

                        <span class="modal-eyebrow">
                            شخصی‌سازی
                        </span>

                        <h2>
                            تنظیمات فروشگاه
                        </h2>

                    </div>


                    <button
                        type="button"
                        class="modal-close"
                        data-settings-close
                    >
                        ×
                    </button>

                </div>


                <form
                    id="storeSettingsForm"
                    class="settings-form"
                >

                    <div
                        class="settings-logo-section"
                    >

                        <div
                            class="settings-logo-preview"
                            id="storeLogoPreview"
                        ></div>


                        <div>

                            <h3>
                                لوگوی فروشگاه
                            </h3>

                            <p>
                                لوگو در فاکتورهای شما نمایش داده می‌شود.
                            </p>

                            <label
                                class="file-button"
                            >

                                انتخاب لوگو

                                <input
                                    id="storeLogo"
                                    type="file"
                                    accept="image/*"
                                    hidden
                                >

                            </label>

                        </div>

                    </div>


                    <div
                        class="settings-grid"
                    >

                        <label
                            class="form-field"
                        >

                            <span>
                                نام فروشگاه
                            </span>

                            <input
                                id="storeName"
                                type="text"
                                placeholder="مثلاً فروشگاه عرشیا"
                            >

                        </label>


                        <label
                            class="form-field"
                        >

                            <span>
                                شماره تماس
                            </span>

                            <input
                                id="storePhone"
                                type="text"
                                placeholder="0912..."
                            >

                        </label>

                    </div>


                    <label
                        class="form-field"
                    >

                        <span>
                            آدرس فروشگاه
                        </span>

                        <textarea
                            id="storeAddress"
                            rows="3"
                            placeholder="آدرس فروشگاه..."
                        ></textarea>

                    </label>


                    <label
                        class="form-field"
                    >

                        <span>
                            توضیحات فاکتور
                        </span>

                        <textarea
                            id="storeDescription"
                            rows="4"
                            placeholder="مثلاً از خرید شما متشکریم..."
                        ></textarea>

                    </label>


                    <div
                        class="settings-actions"
                    >

                        <button
                            type="button"
                            class="secondary-button"
                            data-settings-cancel
                        >
                            انصراف
                        </button>


                        <button
                            type="submit"
                            class="primary-button"
                        >
                            💾 ذخیره تنظیمات
                        </button>

                    </div>

                </form>

            </div>
            `;


        document.body.appendChild(
            modal
        );


        modal
            .querySelector(
                "[data-settings-close]"
            )
            .addEventListener(
                "click",
                () =>
                    modal.classList.remove(
                        "active"
                    )
            );


        modal
            .querySelector(
                "[data-settings-cancel]"
            )
            .addEventListener(
                "click",
                () =>
                    modal.classList.remove(
                        "active"
                    )
            );


        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    modal
                ) {

                    modal.classList.remove(
                        "active"
                    );
                }
            }
        );


        document
            .getElementById(
                "storeSettingsForm"
            )
            .addEventListener(
                "submit",
                saveStoreSettings
            );


        document
            .getElementById(
                "storeLogo"
            )
            .addEventListener(
                "change",
                handleStoreLogo
            );
    }


    document
        .getElementById(
            "storeName"
        ).value =
        storeSettings.storeName || "";


    document
        .getElementById(
            "storePhone"
        ).value =
        storeSettings.phone || "";


    document
        .getElementById(
            "storeAddress"
        ).value =
        storeSettings.address || "";


    document
        .getElementById(
            "storeDescription"
        ).value =
        storeSettings.description || "";


    renderStoreLogoPreview();


    modal.classList.add(
        "active"
    );
}


function handleStoreLogo(event) {

    const file =
        event.target.files?.[0];


    if (!file) return;


    if (
        !file.type.startsWith(
            "image/"
        )
    ) {

        showToast(
            "فقط فایل تصویری انتخاب کنید.",
            "error"
        );

        return;
    }


    if (
        file.size >
        2.5 * 1024 * 1024
    ) {

        showToast(
            "حجم لوگو نباید بیشتر از ۲.۵ مگابایت باشد.",
            "error"
        );

        return;
    }


    const reader =
        new FileReader();


    reader.onload =
        function () {

            storeSettings.logo =
                reader.result;

            renderStoreLogoPreview();
        };


    reader.readAsDataURL(
        file
    );
}


function renderStoreLogoPreview() {

    const container =
        document.getElementById(
            "storeLogoPreview"
        );


    if (!container) return;


    if (
        storeSettings.logo
    ) {

        container.innerHTML =
            `
            <img
                src="${escapeHTML(
                    storeSettings.logo
                )}"
                alt="لوگو"
            >

            <button
                type="button"
                class="logo-remove-button"
                onclick="removeStoreLogo()"
            >
                ×
            </button>
            `;

    } else {

        container.innerHTML =
            `
            <div class="logo-placeholder">
                🏪
            </div>
            `;
    }
}


function removeStoreLogo() {

    storeSettings.logo =
        "";

    renderStoreLogoPreview();
}


function saveStoreSettings(event) {

    event.preventDefault();


    storeSettings = {

        ...storeSettings,

        storeName:
            document
                .getElementById(
                    "storeName"
                )
                ?.value
                .trim() || "",

        phone:
            document
                .getElementById(
                    "storePhone"
                )
                ?.value
                .trim() || "",

        address:
            document
                .getElementById(
                    "storeAddress"
                )
                ?.value
                .trim() || "",

        description:
            document
                .getElementById(
                    "storeDescription"
                )
                ?.value
                .trim() || ""
    };


    if (!saveAll()) {
        return;
    }


    closeModalById(
        "storeSettingsModal"
    );


    showToast(
        "تنظیمات فروشگاه ذخیره شد."
    );
}


/* =========================================================
   EXCEL
   ========================================================= */

function exportProductsToExcel() {

    if (
        typeof XLSX ===
        "undefined"
    ) {

        showToast(
            "کتابخانه Excel بارگذاری نشده است.",
            "error"
        );

        return;
    }


    const data =
        products.map(
            product => ({

                "نام محصول":
                    product.name,

                "دسته‌بندی":
                    getCategoryName(
                        product.category
                    ),

                "قیمت خرید":
                    product.purchasePrice,

                "قیمت فروش":
                    product.salePrice,

                "موجودی":
                    product.stock,

                "کد":
                    product.code,

                "توضیحات":
                    product.description
            })
        );


    const worksheet =
        XLSX.utils.json_to_sheet(
            data
        );


    const workbook =
        XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Products"
    );


    XLSX.writeFile(
        workbook,
        "my-manager-products.xlsx"
    );


    showToast(
        "فایل Excel ساخته شد."
    );
}


/* =========================================================
   MODAL
   ========================================================= */

function closeModalById(id) {

    const modal =
        document.getElementById(
            id
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );
    }
}


/* =========================================================
   FILTER EVENTS
   ========================================================= */

function bindFilterEvents() {

    const elements = [

        document.getElementById(
            "searchInput"
        ),

        document.getElementById(
            "categoryFilter"
        ),

        document.getElementById(
            "stockFilter"
        ),

        document.getElementById(
            "sortFilter"
        )
    ];


    elements
        .filter(Boolean)
        .forEach(
            element => {

                element.addEventListener(
                    "input",
                    renderProducts
                );

                element.addEventListener(
                    "change",
                    renderProducts
                );
            }
        );
}


/* =========================================================
   EVENTS
   ========================================================= */

function bindEvents() {

    const openProduct =
        document.getElementById(
            "openProductButton"
        );


    if (openProduct) {

        openProduct.addEventListener(
            "click",
            () =>
                openProductModal()
        );
    }


    const emptyAdd =
        document.getElementById(
            "emptyAddButton"
        );


    if (emptyAdd) {

        emptyAdd.addEventListener(
            "click",
            () =>
                openProductModal()
        );
    }


    const addCategory =
        document.getElementById(
            "addCategoryButton"
        );


    if (addCategory) {

        addCategory.addEventListener(
            "click",
            openCategoryModal
        );
    }


    const productForm =
        document.getElementById(
            "productForm"
        );


    if (productForm) {

        productForm.addEventListener(
            "submit",
            saveProduct
        );
    }


    const categoryForm =
        document.getElementById(
            "categoryForm"
        );


    if (categoryForm) {

        categoryForm.addEventListener(
            "submit",
            saveCategory
        );
    }


    const productImage =
        document.getElementById(
            "productImage"
        );


    if (productImage) {

        productImage.addEventListener(
            "change",
            handleImageUpload
        );
    }


    const removeImageButton =
        document.getElementById(
            "removeImageButton"
        );


    if (removeImageButton) {

        removeImageButton.addEventListener(
            "click",
            removeImage
        );
    }


    const openCartButton =
        document.getElementById(
            "openCartButton"
        );


    if (openCartButton) {

        openCartButton.addEventListener(
            "click",
            openCart
        );
    }


    const closeCartButton =
        document.getElementById(
            "closeCartButton"
        );


    if (closeCartButton) {

        closeCartButton.addEventListener(
            "click",
            closeCart
        );
    }


    const checkoutButton =
        document.getElementById(
            "checkoutButton"
        );


    if (checkoutButton) {

        checkoutButton.addEventListener(
            "click",
            checkout
        );
    }


    const clearCartButton =
        document.getElementById(
            "clearCartButton"
        );


    if (clearCartButton) {

        clearCartButton.addEventListener(
            "click",
            clearCart
        );
    }


    const discountInput =
        document.getElementById(
            "discountInput"
        );


    const taxInput =
        document.getElementById(
            "taxInput"
        );


    if (discountInput) {

        discountInput.addEventListener(
            "input",
            updateCartTotals
        );
    }


    if (taxInput) {

        taxInput.addEventListener(
            "input",
            updateCartTotals
        );
    }


    document
        .querySelectorAll(
            ".discount-type, .tax-type"
        )
        .forEach(
            element => {

                element.addEventListener(
                    "change",
                    updateCartTotals
                );
            }
        );


    document
        .querySelectorAll(
            "[data-close]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const modal =
                            button.closest(
                                ".modal"
                            );

                        if (modal) {

                            modal.classList.remove(
                                "active"
                            );
                        }
                    }
                );
            }
        );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape"
            ) {

                document
                    .querySelectorAll(
                        ".modal.active"
                    )
                    .forEach(
                        modal =>
                            modal.classList.remove(
                                "active"
                            )
                    );

                closeCart();
            }
        }
    );


    bindFilterEvents();
}


/* =========================================================
   RENDER ALL
   ========================================================= */

function renderAll() {

    renderCategorySelect();

    renderCategoryFilter();

    renderProducts();

    renderStats();

    renderCartCount();
}


/* =========================================================
   DEBUG
   ========================================================= */

function debugStorage() {

    console.group(
        "MY MANAGER STORAGE"
    );


    Object.values(
        STORAGE_KEYS
    )
        .forEach(
            key => {

                const value =
                    localStorage.getItem(
                        key
                    );


                console.log(
                    key,
                    value
                        ? {
                            saved: true,
                            size:
                                value.length
                        }
                        : {
                            saved: false
                        }
                );
            }
        );


    console.log(
        "Products:",
        products
    );

    console.log(
        "Categories:",
        categories
    );

    console.log(
        "Cart:",
        cart
    );

    console.log(
        "Invoices:",
        invoices
    );

    console.log(
        "Settings:",
        storeSettings
    );


    console.groupEnd();
}


/* =========================================================
   GLOBALS
   ========================================================= */

window.openProductModal =
    openProductModal;

window.editProduct =
    editProduct;

window.deleteProduct =
    deleteProduct;

window.addToCart =
    addToCart;

window.removeFromCart =
    removeFromCart;

window.changeCartQuantity =
    changeCartQuantity;

window.openCart =
    openCart;

window.closeCart =
    closeCart;

window.clearCart =
    clearCart;

window.checkout =
    checkout;

window.deleteInvoice =
    deleteInvoice;

window.deleteAllInvoices =
    deleteAllInvoices;

window.cancelInvoice =
    cancelInvoice;

window.viewInvoice =
    viewInvoice;

window.printInvoice =
    printInvoice;

window.removeStoreLogo =
    removeStoreLogo;

window.exportProductsToExcel =
    exportProductsToExcel;

window.debugStorage =
    debugStorage;


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "MY MANAGER STARTING..."
        );


        if (
            !isStorageAvailable()
        ) {

            showToast(
                "LocalStorage در دسترس نیست.",
                "error"
            );
        }


        loadData();

        bindEvents();

        createInvoiceHistoryButton();

        createStoreSettingsButton();

        renderAll();


        console.log(
            "MY MANAGER READY"
        );
    }
);