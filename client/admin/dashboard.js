// ==========================================
// AUTHENTICATION CHECK
// ==========================================

const token =
    localStorage.getItem(
        "carCrazeAdminToken"
    );


if (!token) {

    window.location.href =
        "index.html";

}


// ==========================================
// ADMIN USERNAME
// ==========================================

const adminUsername =
    localStorage.getItem(
        "carCrazeAdminUsername"
    );


const usernameElement =
    document.getElementById(
        "adminUsername"
    );


if (adminUsername) {

    usernameElement.textContent =
        adminUsername;

}


// ==========================================
// NAVIGATION
// ==========================================

const navItems =
    document.querySelectorAll(
        ".nav-item"
    );


const sections =
    document.querySelectorAll(
        ".dashboard-section"
    );


const pageTitle =
    document.getElementById(
        "pageTitle"
    );


const showSection =
    (sectionName) => {


        // Hide all sections

        sections.forEach(
            (section) => {

                section.classList.remove(
                    "active-section"
                );

            }
        );


        // Show selected section

        const targetSection =
            document.getElementById(
                `${sectionName}Section`
            );


        if (targetSection) {

            targetSection.classList.add(
                "active-section"
            );

        }


        // Update navigation

        navItems.forEach(
            (item) => {

                item.classList.remove(
                    "active"
                );


                if (
                    item.dataset.section ===
                    sectionName
                ) {

                    item.classList.add(
                        "active"
                    );

                }

            }
        );


        // Update title

        const activeItem =
            document.querySelector(
                `.nav-item[data-section="${sectionName}"]`
            );


        if (activeItem) {

            pageTitle.textContent =
                activeItem
                    .querySelector(
                        "span:last-child"
                    )
                    .textContent;

        }

    };


// Navigation click

navItems.forEach(
    (item) => {

        item.addEventListener(
            "click",
            () => {

                showSection(
                    item.dataset.section
                );

                closeMobileMenu();

            }
        );

    }
);


// Quick action buttons

const quickActions =
    document.querySelectorAll(
        ".quick-action"
    );


quickActions.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                showSection(
                    button.dataset.section
                );

            }
        );

    }
);


// ==========================================
// MOBILE MENU
// ==========================================

const sidebar =
    document.getElementById(
        "sidebar"
    );


const sidebarOverlay =
    document.getElementById(
        "sidebarOverlay"
    );


const menuButton =
    document.getElementById(
        "menuButton"
    );


const closeMobileMenu =
    () => {

        sidebar.classList.remove(
            "open"
        );

        sidebarOverlay.classList.remove(
            "active"
        );

    };


menuButton.addEventListener(
    "click",
    () => {

        sidebar.classList.add(
            "open"
        );

        sidebarOverlay.classList.add(
            "active"
        );

    }
);


sidebarOverlay.addEventListener(
    "click",
    closeMobileMenu
);


// ==========================================
// LOGOUT
// ==========================================

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


logoutButton.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "carCrazeAdminToken"
        );

        localStorage.removeItem(
            "carCrazeAdminUsername"
        );


        window.location.href =
            "index.html";

    }
);



// ==========================================
// CATEGORY MANAGEMENT
// ==========================================

const API_URL =
    "https://car-craze-api.onrender.com";


// Elements

const categoryForm =
    document.getElementById(
        "categoryForm"
    );


const categoryName =
    document.getElementById(
        "categoryName"
    );


const subcategoryInputs =
    document.getElementById(
        "subcategoryInputs"
    );


const addSubcategoryButton =
    document.getElementById(
        "addSubcategoryButton"
    );


const categoryList =
    document.getElementById(
        "categoryList"
    );


// ==========================================
// ADD SUBCATEGORY INPUT
// ==========================================

if (addSubcategoryButton) {

    addSubcategoryButton.addEventListener(
        "click",
        () => {

            const input =
                document.createElement(
                    "input"
                );


            input.type =
                "text";


            input.className =
                "subcategory-input";


            input.placeholder =
                "Enter subcategory name";


            subcategoryInputs.appendChild(
                input
            );

        }
    );

}


// ==========================================
// LOAD CATEGORIES
// ==========================================

async function loadCategories() {

    try {

        const response =
            await fetch(
                `${API_URL}/api/categories`
            );


        const categories =
            await response.json();


        categoryList.innerHTML =
            "";


        if (
            categories.length === 0
        ) {

            categoryList.innerHTML = `

                <p class="loading-text">

                    No categories yet.
                    Create your first category.

                </p>

            `;

            return;

        }


        categories.forEach(
            (category) => {

                const categoryElement =
                    document.createElement(
                        "div"
                    );


                categoryElement.className =
                    "category-item";


                let subcategoriesHTML =
                    "";


                category.subcategories.forEach(
                    (subcategory) => {

                        subcategoriesHTML += `

                            <span
                                class="subcategory-tag"
                            >

                                ${subcategory}

                            </span>

                        `;

                    }
                );


                categoryElement.innerHTML = `

                    <div
                        class="category-item-header"
                    >

                        <h4>
                            ${category.name}
                        </h4>

                        <button
                            class="delete-category"
                            onclick="deleteCategory('${category._id}')"
                        >

                            Delete

                        </button>

                    </div>


                    <div
                        class="subcategory-list"
                    >

                        ${subcategoriesHTML}

                    </div>

                `;


                categoryList.appendChild(
                    categoryElement
                );

            }
        );


    } catch (error) {

        console.error(
            error
        );


        categoryList.innerHTML = `

            <p class="loading-text">

                Failed to load categories.

            </p>

        `;

    }

}


// ==========================================
// CREATE CATEGORY
// ==========================================

if (categoryForm) {

    categoryForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const name =
                categoryName.value.trim();


            const inputs =
                document.querySelectorAll(
                    ".subcategory-input"
                );


            const subcategories =
                Array.from(
                    inputs
                )

                .map(
                    (input) =>
                        input.value.trim()
                )

                .filter(
                    (value) =>
                        value !== ""
                );


            if (!name) {

                alert(
                    "Please enter a category name."
                );

                return;

            }


            try {

                const response =
                    await fetch(
                        `${API_URL}/api/categories`,
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`

                            },

                            body:
                                JSON.stringify({

                                    name,

                                    subcategories

                                })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    alert(
                        data.message ||
                        "Failed to create category."
                    );

                    return;

                }


                alert(
                    "Category created successfully!"
                );


                categoryForm.reset();


                subcategoryInputs.innerHTML = `

                    <input
                        type="text"
                        class="subcategory-input"
                        placeholder="Example: Seat Covers"
                    >

                `;


                loadCategories();


            } catch (error) {

                console.error(
                    error
                );


                alert(
                    "Failed to connect to server."
                );

            }

        }
    );

}


// ==========================================
// DELETE CATEGORY
// ==========================================

async function deleteCategory(
    categoryId
) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this category?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/categories/${categoryId}`,
                {

                    method:
                        "DELETE",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Failed to delete category."
            );

            return;

        }


        loadCategories();


    } catch (error) {

        console.error(
            error
        );


        alert(
            "Failed to connect to server."
        );

    }

}


// ==========================================
// PRODUCT MANAGEMENT
// ==========================================

// Elements

const productGrid =
    document.getElementById(
        "productGrid"
    );


const addProductButton =
    document.getElementById(
        "addProductButton"
    );


const productModalOverlay =
    document.getElementById(
        "productModalOverlay"
    );


const productModalTitle =
    document.getElementById(
        "productModalTitle"
    );


const productForm =
    document.getElementById(
        "productForm"
    );


const productIdInput =
    document.getElementById(
        "productId"
    );


const productNameInput =
    document.getElementById(
        "productName"
    );


const productMrpInput =
    document.getElementById(
        "productMrp"
    );


const productSellingPriceInput =
    document.getElementById(
        "productSellingPrice"
    );


const productStockInput =
    document.getElementById(
        "productStock"
    );


const productCategorySelect =
    document.getElementById(
        "productCategory"
    );


const productSubcategorySelect =
    document.getElementById(
        "productSubcategory"
    );


// ==========================================
// CLOUDINARY CONFIG
// ==========================================
// Fill these in with your own Cloudinary details.
// See the setup guide shared alongside this file for
// how to get these two values.

const CLOUDINARY_CLOUD_NAME =
    "ycgnvom3";


const CLOUDINARY_UPLOAD_PRESET =
    "car_craze_products";


const MAX_PHOTOS =
    5;


const MAX_PHOTO_KB =
    200;


// Holds the working set of photos for the product
// currently open in the modal. Each entry:
// { url, previewSrc, status: "compressing"|"uploading"|"done"|"error" }

let productPhotos =
    [];


const photoDropzone =
    document.getElementById(
        "photoDropzone"
    );


const photoFileInput =
    document.getElementById(
        "photoFileInput"
    );


const photoPreviewList =
    document.getElementById(
        "photoPreviewList"
    );


const productDescriptionInput =
    document.getElementById(
        "productDescription"
    );


const productBrandInput =
    document.getElementById(
        "productBrand"
    );


const productWarrantyInput =
    document.getElementById(
        "productWarranty"
    );


const productFeaturedInput =
    document.getElementById(
        "productFeatured"
    );


const closeProductModalButton =
    document.getElementById(
        "closeProductModal"
    );


const cancelProductFormButton =
    document.getElementById(
        "cancelProductForm"
    );


// Keep the categories fetched for products in memory
// so the subcategory dropdown can be populated
// based on the selected category, without refetching.

let cachedCategories = [];


// ==========================================
// OPEN / CLOSE MODAL
// ==========================================

function openProductModal() {

    productModalOverlay.classList.add(
        "active"
    );

}


function closeProductModal() {

    productModalOverlay.classList.remove(
        "active"
    );


    productForm.reset();


    productIdInput.value =
        "";


    productModalTitle.textContent =
        "Add Product";


    productSubcategorySelect.innerHTML = `
        <option value="">Select subcategory</option>
    `;


    productPhotos =
        [];


    renderPhotoPreviews();

}


if (addProductButton) {

    addProductButton.addEventListener(
        "click",
        () => {

            productModalTitle.textContent =
                "Add Product";

            openProductModal();

        }
    );

}


if (closeProductModalButton) {

    closeProductModalButton.addEventListener(
        "click",
        closeProductModal
    );

}


if (cancelProductFormButton) {

    cancelProductFormButton.addEventListener(
        "click",
        closeProductModal
    );

}


// Close modal when clicking outside it

if (productModalOverlay) {

    productModalOverlay.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                productModalOverlay
            ) {

                closeProductModal();

            }

        }
    );

}


// ==========================================
// PHOTO UPLOAD — compress + upload to Cloudinary
// ==========================================

// Compresses an image file down under MAX_PHOTO_KB by
// drawing it to a canvas, shrinking dimensions if needed,
// and stepping down JPEG quality until it fits.

function compressImage(file) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onerror =
                () => reject(
                    new Error("Could not read file.")
                );


            reader.onload =
                () => {

                    const img =
                        new Image();


                    img.onerror =
                        () => reject(
                            new Error("Not a valid image.")
                        );


                    img.onload =
                        () => {

                            const maxDimension =
                                1600;


                            let width =
                                img.width;


                            let height =
                                img.height;


                            if (
                                width > maxDimension ||
                                height > maxDimension
                            ) {

                                if (width > height) {

                                    height =
                                        Math.round(
                                            height * (maxDimension / width)
                                        );

                                    width =
                                        maxDimension;

                                } else {

                                    width =
                                        Math.round(
                                            width * (maxDimension / height)
                                        );

                                    height =
                                        maxDimension;

                                }

                            }


                            const canvas =
                                document.createElement(
                                    "canvas"
                                );


                            canvas.width =
                                width;


                            canvas.height =
                                height;


                            const ctx =
                                canvas.getContext("2d");


                            ctx.drawImage(
                                img, 0, 0, width, height
                            );


                            const targetBytes =
                                MAX_PHOTO_KB * 1024;


                            let quality =
                                0.9;


                            const tryCompress =
                                () => {

                                    canvas.toBlob(
                                        (blob) => {

                                            if (!blob) {

                                                reject(
                                                    new Error("Compression failed.")
                                                );

                                                return;

                                            }


                                            if (
                                                blob.size <= targetBytes ||
                                                quality <= 0.35
                                            ) {

                                                resolve(
                                                    blob
                                                );

                                                return;

                                            }


                                            quality =
                                                quality - 0.15;


                                            tryCompress();

                                        },
                                        "image/jpeg",
                                        quality
                                    );

                                };


                            tryCompress();

                        };


                    img.src =
                        reader.result;

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


// Uploads a compressed blob to Cloudinary using an
// unsigned upload preset and returns the hosted URL.

async function uploadToCloudinary(blob) {

    if (
        CLOUDINARY_CLOUD_NAME === "YOUR_CLOUD_NAME" ||
        CLOUDINARY_UPLOAD_PRESET === "YOUR_UNSIGNED_UPLOAD_PRESET"
    ) {

        throw new Error(
            "Cloudinary isn't configured yet — add your cloud name and upload preset at the top of dashboard.js."
        );

    }


    const formData =
        new FormData();


    formData.append(
        "file", blob
    );


    formData.append(
        "upload_preset", CLOUDINARY_UPLOAD_PRESET
    );


    const response =
        await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            {

                method: "POST",

                body: formData

            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data?.error?.message || "Cloudinary upload failed."
        );

    }


    return data.secure_url;

}


// ==========================================
// PHOTO PREVIEW RENDERING
// ==========================================

function renderPhotoPreviews() {

    photoPreviewList.innerHTML =
        "";


    productPhotos.forEach(
        (photo, index) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "photo-preview-item";


            let statusHTML =
                "";


            if (photo.status === "compressing") {

                statusHTML =
                    '<div class="photo-preview-status">Compressing…</div>';

            } else if (photo.status === "uploading") {

                statusHTML =
                    '<div class="photo-preview-status">Uploading…</div>';

            } else if (photo.status === "error") {

                statusHTML =
                    '<div class="photo-preview-status error">Failed</div>';

            }


            item.innerHTML = `

                <img src="${photo.previewSrc}" alt="Product photo">

                ${statusHTML}

                <button
                    type="button"
                    class="photo-preview-remove"
                    data-index="${index}"
                >✕</button>

            `;


            photoPreviewList.appendChild(
                item
            );

        }
    );


    // Toggle the dropzone once the 5-photo limit is hit

    if (productPhotos.length >= MAX_PHOTOS) {

        photoDropzone.classList.add(
            "disabled"
        );

    } else {

        photoDropzone.classList.remove(
            "disabled"
        );

    }

}


// Remove a photo from the working set (click on the ✕)

if (photoPreviewList) {

    photoPreviewList.addEventListener(
        "click",
        (event) => {

            const button =
                event.target.closest(
                    ".photo-preview-remove"
                );


            if (!button) {

                return;

            }


            const index =
                Number(button.dataset.index);


            productPhotos.splice(
                index, 1
            );


            renderPhotoPreviews();

        }
    );

}


// ==========================================
// HANDLE NEW FILES (compress → upload)
// ==========================================

async function handlePhotoFiles(fileList) {

    const files =
        Array.from(fileList).filter(
            (file) =>
                file.type.startsWith("image/")
        );


    if (files.length === 0) {

        return;

    }


    const availableSlots =
        MAX_PHOTOS - productPhotos.length;


    if (availableSlots <= 0) {

        alert(
            `You can only add up to ${MAX_PHOTOS} photos per product.`
        );

        return;

    }


    if (files.length > availableSlots) {

        alert(
            `Only ${availableSlots} more photo(s) can be added (max ${MAX_PHOTOS}). The rest were skipped.`
        );

    }


    const filesToProcess =
        files.slice(0, availableSlots);


    for (const file of filesToProcess) {

        const localPreviewUrl =
            URL.createObjectURL(file);


        const photoEntry = {

            url: "",

            previewSrc: localPreviewUrl,

            status: "compressing"

        };


        productPhotos.push(
            photoEntry
        );


        renderPhotoPreviews();


        try {

            const compressedBlob =
                await compressImage(file);


            photoEntry.status =
                "uploading";


            renderPhotoPreviews();


            const uploadedUrl =
                await uploadToCloudinary(compressedBlob);


            photoEntry.url =
                uploadedUrl;

            photoEntry.previewSrc =
                uploadedUrl;

            photoEntry.status =
                "done";


        } catch (error) {

            console.error(
                error
            );


            photoEntry.status =
                "error";


            alert(
                error.message || "Photo upload failed."
            );

        }


        renderPhotoPreviews();

    }

}


// Click dropzone → open file picker

if (photoDropzone) {

    photoDropzone.addEventListener(
        "click",
        () => {

            photoFileInput.click();

        }
    );

}


// File picker selection

if (photoFileInput) {

    photoFileInput.addEventListener(
        "change",
        (event) => {

            handlePhotoFiles(
                event.target.files
            );


            photoFileInput.value =
                "";

        }
    );

}


// Drag & drop

if (photoDropzone) {

    ["dragenter", "dragover"].forEach(
        (eventName) => {

            photoDropzone.addEventListener(
                eventName,
                (event) => {

                    event.preventDefault();

                    photoDropzone.classList.add(
                        "drag-over"
                    );

                }
            );

        }
    );


    ["dragleave", "drop"].forEach(
        (eventName) => {

            photoDropzone.addEventListener(
                eventName,
                (event) => {

                    event.preventDefault();

                    photoDropzone.classList.remove(
                        "drag-over"
                    );

                }
            );

        }
    );


    photoDropzone.addEventListener(
        "drop",
        (event) => {

            if (event.dataTransfer?.files?.length) {

                handlePhotoFiles(
                    event.dataTransfer.files
                );

            }

        }
    );

}


// ==========================================
// LOAD CATEGORIES INTO PRODUCT FORM
// ==========================================

async function loadCategoriesForProductForm() {

    try {

        const response =
            await fetch(
                `${API_URL}/api/categories`
            );


        const categories =
            await response.json();


        cachedCategories =
            categories;


        productCategorySelect.innerHTML = `
            <option value="">Select category</option>
        `;


        categories.forEach(
            (category) => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    category._id;


                option.textContent =
                    category.name;


                productCategorySelect.appendChild(
                    option
                );

            }
        );


    } catch (error) {

        console.error(
            error
        );

    }

}


// Populate subcategory dropdown when a category is chosen

if (productCategorySelect) {

    productCategorySelect.addEventListener(
        "change",
        () => {

            const selectedCategory =
                cachedCategories.find(
                    (category) =>
                        category._id ===
                        productCategorySelect.value
                );


            productSubcategorySelect.innerHTML = `
                <option value="">Select subcategory</option>
            `;


            if (
                selectedCategory &&
                selectedCategory.subcategories
            ) {

                selectedCategory.subcategories.forEach(
                    (subcategory) => {

                        const option =
                            document.createElement(
                                "option"
                            );


                        option.value =
                            subcategory;


                        option.textContent =
                            subcategory;


                        productSubcategorySelect.appendChild(
                            option
                        );

                    }
                );

            }

        }
    );

}


// ==========================================
// LOAD PRODUCTS
// ==========================================

async function loadProducts() {

    try {

        const response =
            await fetch(
                `${API_URL}/api/products`
            );


        const data =
            await response.json();


        const products =
            data.products || [];


        productGrid.innerHTML =
            "";


        if (
            products.length === 0
        ) {

            productGrid.innerHTML = `

                <p class="loading-text">

                    No products yet.
                    Add your first product.

                </p>

            `;

            return;

        }


        products.forEach(
            (product) => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "product-card";


                const inStock =
                    Number(product.stock) > 0;


                const thumbnailUrl =
                    (Array.isArray(product.images) && product.images[0]) ||
                    product.image ||
                    "";


                const imageHTML =
                    thumbnailUrl
                        ? `<div class="product-card-image" style="background-image:url('${thumbnailUrl}')"></div>`
                        : `<div class="product-card-image">🛍️</div>`;


                const categoryLabel =
                    (product.category && product.category.name) || "";


                const priceHTML =
                    product.mrp && product.mrp > product.sellingPrice
                        ? `<span class="product-card-mrp">₹${product.mrp}</span> <span class="product-card-price">₹${product.sellingPrice}</span>`
                        : `<span class="product-card-price">₹${product.sellingPrice}</span>`;


                card.innerHTML = `

                    ${imageHTML}

                    <div class="product-card-body">

                        <h4>${product.name}</h4>

                        <span class="product-card-meta">
                            ${product.brand ? product.brand + " · " : ""}${categoryLabel}
                            ${product.subcategory ? " · " + product.subcategory : ""}
                        </span>

                        ${priceHTML}

                        <div class="product-card-badges">

                            <span class="badge ${inStock ? "in-stock" : "out-stock"}">
                                ${inStock ? "In Stock" : "Out of Stock"}
                            </span>

                            ${product.featured
                                ? '<span class="badge featured">Featured</span>'
                                : ""
                            }

                        </div>

                        <div class="product-card-actions">

                            <button
                                class="edit-product"
                                onclick='editProduct(${JSON.stringify(product).replace(/'/g, "&apos;")})'
                            >
                                Edit
                            </button>

                            <button
                                class="delete-product"
                                onclick="deleteProduct('${product._id}')"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                `;


                productGrid.appendChild(
                    card
                );

            }
        );


    } catch (error) {

        console.error(
            error
        );


        productGrid.innerHTML = `

            <p class="loading-text">

                Failed to load products.

            </p>

        `;

    }

}


// ==========================================
// EDIT PRODUCT (opens modal pre-filled)
// ==========================================

function editProduct(product) {

    productModalTitle.textContent =
        "Edit Product";


    productIdInput.value =
        product._id;


    productNameInput.value =
        product.name || "";


    productMrpInput.value =
        product.mrp || "";


    productSellingPriceInput.value =
        product.sellingPrice || "";


    productStockInput.value =
        product.stock || "";


    // Support both the new "images" array and the
    // older single "image" field, in case some
    // existing products were saved before this update.

    const existingImages =
        Array.isArray(product.images) &&
        product.images.length > 0
            ? product.images
            : (product.image ? [product.image] : []);


    productPhotos =
        existingImages.map(
            (url) => ({

                url,

                previewSrc: url,

                status: "done"

            })
        );


    renderPhotoPreviews();


    productDescriptionInput.value =
        product.description || "";


    productBrandInput.value =
        product.brand || "";


    productWarrantyInput.value =
        product.warranty || "";


    productFeaturedInput.checked =
        Boolean(product.featured);


    productCategorySelect.value =
        (product.category && product.category._id) ||
        product.category ||
        "";


    // Trigger subcategory population, then set the saved value

    productCategorySelect.dispatchEvent(
        new Event("change")
    );


    setTimeout(
        () => {

            productSubcategorySelect.value =
                product.subcategory || "";

        },
        0
    );


    openProductModal();

}


// ==========================================
// SAVE PRODUCT (create or update)
// ==========================================

if (productForm) {

    productForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const id =
                productIdInput.value;


            const stillUploading =
                productPhotos.some(
                    (photo) =>
                        photo.status === "compressing" ||
                        photo.status === "uploading"
                );


            if (stillUploading) {

                alert(
                    "Please wait for photo upload to finish before saving."
                );

                return;

            }


            const uploadedImageUrls =
                productPhotos

                    .filter(
                        (photo) =>
                            photo.status === "done" &&
                            photo.url
                    )

                    .map(
                        (photo) =>
                            photo.url
                    );


            const payload = {

                name:
                    productNameInput.value.trim(),

                mrp:
                    Number(productMrpInput.value),

                sellingPrice:
                    Number(productSellingPriceInput.value),

                stock:
                    Number(productStockInput.value),

                category:
                    productCategorySelect.value,

                subcategory:
                    productSubcategorySelect.value,

                brand:
                    productBrandInput.value.trim(),

                warranty:
                    productWarrantyInput.value.trim(),

                images:
                    uploadedImageUrls,

                image:
                    uploadedImageUrls[0] || "",

                description:
                    productDescriptionInput.value.trim(),

                featured:
                    productFeaturedInput.checked

            };


            if (
                !payload.name ||
                !payload.category ||
                !payload.subcategory ||
                Number.isNaN(payload.mrp) ||
                Number.isNaN(payload.sellingPrice) ||
                Number.isNaN(payload.stock)
            ) {

                alert(
                    "Please fill in all required fields."
                );

                return;

            }


            try {

                const response =
                    await fetch(
                        id
                            ? `${API_URL}/api/products/${id}`
                            : `${API_URL}/api/products`,
                        {

                            method:
                                id ? "PUT" : "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`

                            },

                            body:
                                JSON.stringify(payload)

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    alert(
                        data.message ||
                        "Failed to save product."
                    );

                    return;

                }


                alert(
                    id
                        ? "Product updated successfully!"
                        : "Product created successfully!"
                );


                closeProductModal();


                loadProducts();


            } catch (error) {

                console.error(
                    error
                );


                alert(
                    "Failed to connect to server."
                );

            }

        }
    );

}


// ==========================================
// DELETE PRODUCT
// ==========================================

async function deleteProduct(
    productId
) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this product?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/products/${productId}`,
                {

                    method:
                        "DELETE",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Failed to delete product."
            );

            return;

        }


        loadProducts();


    } catch (error) {

        console.error(
            error
        );


        alert(
            "Failed to connect to server."
        );

    }

}


// ==========================================
// INITIAL LOAD
// ==========================================

loadCategories();

loadProducts();

loadCategoriesForProductForm();