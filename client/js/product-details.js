const API_URL = "http://localhost:5000";
const WHATSAPP_NUMBER = "919995060070";
const LOCATION_URL = "https://maps.app.goo.gl/heQ5rSSPRQRsfebe8";

const page = document.getElementById("productPage");
const orderOverlay = document.getElementById("orderOverlay");
const orderClose = document.getElementById("orderClose");
const orderForm = document.getElementById("orderForm");
const orderProductName = document.getElementById("orderProductName");
const vehicleName = document.getElementById("vehicleName");
const vehicleYear = document.getElementById("vehicleYear");
const vehicleVariant = document.getElementById("vehicleVariant");
const bookingDate = document.getElementById("bookingDate");
const bookingTime = document.getElementById("bookingTime");
const bookingConfirmation = document.getElementById("bookingConfirmation");

let currentProduct = null;

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g,"&amp;").replace(/</g,"&lt;")
        .replace(/>/g,"&gt;").replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");
}

function listFromResponse(data,key){
    if(Array.isArray(data)) return data;
    if(Array.isArray(data?.[key])) return data[key];
    if(Array.isArray(data?.data)) return data.data;
    return [];
}

function extractProduct(data,id){
    if(data?.product && typeof data.product === "object") return data.product;
    if(data?.data && !Array.isArray(data.data) && (data.data._id || data.data.slug)) return data.data;
    if(Array.isArray(data?.products)) return data.products.find(p=>String(p._id)===String(id)||String(p.slug)===String(id)) || null;
    if(Array.isArray(data)) return data.find(p=>String(p._id)===String(id)||String(p.slug)===String(id)) || null;
    if(data?._id || data?.slug) return data;
    return null;
}

function images(product){
    if(Array.isArray(product?.images) && product.images.length) return product.images.filter(Boolean);
    if(product?.image) return [product.image];
    return [];
}

function price(product){
    const n=Number(product?.sellingPrice ?? product?.price);
    return Number.isFinite(n) ? `₹${n.toLocaleString("en-IN")}` : "Price on request";
}
function mrp(product){
    const n=Number(product?.mrp);
    return Number.isFinite(n)&&n>0 ? `₹${n.toLocaleString("en-IN")}` : "";
}
function category(product){
    if(product?.categoryName) return product.categoryName;
    if(product?.category && typeof product.category === "object") return product.category.name || "Car Accessories";
    return product?.category || "Car Accessories";
}
function highlights(product){
    if(Array.isArray(product?.highlights)) return product.highlights.filter(Boolean);
    if(typeof product?.highlights === "string") return product.highlights.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
    return [];
}

function renderProduct(product){
    currentProduct=product;
    const imgs=images(product);
    const main=imgs[0] || "";
    const cat=category(product);
    const stock=Number(product?.stock)>0;
    const hi=highlights(product);

    document.title=`${product?.name || "Product"} | CAR CRAZE`;

    page.innerHTML=`
        <section class="product-details-grid">
            <div class="product-gallery">
                <div class="product-main-image-wrap">
                    ${main ? `<img id="productMainImage" class="product-main-image" src="${escapeHTML(main)}" alt="${escapeHTML(product.name||"Product")}">` : `<div class="product-gallery-empty"><i class="fa-solid fa-car"></i><span>No product image</span></div>`}
                </div>
                ${imgs.length>1 ? `<div class="product-thumbnails">${imgs.map((src,i)=>`<button class="product-thumbnail ${i===0?"active":""}" type="button" data-image="${escapeHTML(src)}"><img src="${escapeHTML(src)}" alt="Product image ${i+1}"></button>`).join("")}</div>`:""}
            </div>

            <article class="product-detail-content">
                <span class="product-detail-category"><i class="fa-solid fa-tag"></i>${escapeHTML(cat)}${product?.subcategory?` · ${escapeHTML(product.subcategory)}`:""}</span>
                <h1>${escapeHTML(product?.name||"Product")}</h1>
                ${product?.brand?`<p class="product-detail-brand">Brand: ${escapeHTML(product.brand)}</p>`:""}

                <div class="product-detail-price">
                    ${mrp(product)?`<span class="product-detail-mrp">${mrp(product)}</span>`:""}
                    <strong>${price(product)}</strong>
                </div>

                <span class="product-detail-stock ${stock?"in-stock":"out-stock"}"><i class="fa-solid fa-circle"></i>${stock?"In Stock":"Currently Out of Stock"}</span>

                ${product?.description?`<div class="product-detail-description">${escapeHTML(product.description).replace(/\n/g,"<br>")}</div>`:""}

                ${hi.length?`<div class="product-detail-highlights"><h3>Product Highlights</h3>${hi.map(x=>`<div class="product-detail-highlight"><i class="fa-solid fa-check"></i><span>${escapeHTML(x)}</span></div>`).join("")}</div>`:""}

                <div class="product-specs">
                    <h3>Product Information</h3>
                    ${[["Category",cat],["Subcategory",product?.subcategory||"Not specified"],["Brand",product?.brand||"Not specified"],["Warranty",product?.warranty||"Not specified"],["Stock",stock?"In Stock":"Currently unavailable"]].map(([a,b])=>`<div class="product-spec-row"><strong>${escapeHTML(a)}</strong><span>${escapeHTML(b)}</span></div>`).join("")}
                </div>

                <button id="orderNowButton" class="product-order-button" type="button" ${stock?"":"disabled"}>
                    <i class="fa-brands fa-whatsapp"></i>${stock?"Order Now":"Currently Unavailable"}
                </button>
                <p class="order-note"><i class="fa-solid fa-shield-halved"></i> Confirm availability and schedule installation with CAR CRAZE on WhatsApp.</p>
            </article>
        </section>
    `;

    document.querySelectorAll(".product-thumbnail").forEach(btn=>btn.addEventListener("click",()=>{
        const mainImage=document.getElementById("productMainImage");
        if(mainImage) mainImage.src=btn.dataset.image;
        document.querySelectorAll(".product-thumbnail").forEach(x=>x.classList.remove("active"));
        btn.classList.add("active");
    }));

    document.getElementById("orderNowButton")?.addEventListener("click",openOrderModal);
    if(orderProductName) orderProductName.textContent=product.name || "Selected product";
}

function showError(message="Product not found."){
    page.innerHTML=`<div class="product-page-error"><i class="fa-solid fa-box-open"></i><h1>${escapeHTML(message)}</h1><p>We could not find the product you requested.</p><a href="index.html" class="location-button">Back to Store <i class="fa-solid fa-arrow-right"></i></a></div>`;
}

async function loadProduct(){
    const params=new URLSearchParams(location.search);
    const id=params.get("id") || params.get("slug");
    if(!id){showError();return;}

    try{
        let product=null;
        try{
            const r=await fetch(`${API_URL}/api/products/${encodeURIComponent(id)}`,{cache:"no-store"});
            if(r.ok) product=extractProduct(await r.json(),id);
        }catch(e){console.warn("Direct product lookup failed",e)}

        if(!product){
            const r=await fetch(`${API_URL}/api/products`,{cache:"no-store"});
            if(!r.ok) throw new Error("Could not load products");
            product=extractProduct(await r.json(),id);
        }

        if(!product){showError();return;}
        renderProduct(product);
    }catch(error){
        console.error(error);
        showError("Unable to load product.");
    }
}

function populateTimes(){
    if(!bookingTime)return;
    bookingTime.innerHTML='<option value="">Select a time</option>';
    for(let h=9;h<=20;h++){
        for(let m=0;m<60;m+=30){
            if(h===9&&m<30)continue;
            if(h===20&&m>30)continue;
            const value=`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
            const hour=h%12||12;
            const suffix=h>=12?"PM":"AM";
            const option=document.createElement("option");
            option.value=value;
            option.textContent=`${hour}:${String(m).padStart(2,"0")} ${suffix}`;
            bookingTime.appendChild(option);
        }
    }
}

function setMinDate(){
    if(!bookingDate)return;
    const now=new Date();
    const local=new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().split("T")[0];
    bookingDate.min=local;
}
function sunday(value){return value && new Date(`${value}T00:00:00`).getDay()===0}
const orderErrorElement = document.getElementById("orderError");
function showOrderError(message){ if(!orderErrorElement) return; orderErrorElement.textContent=message; orderErrorElement.classList.add("show"); }
function clearError(){orderErrorElement?.classList.remove("show")}

function openOrderModal(){
    clearError();
    orderOverlay?.classList.add("active");
    orderOverlay?.setAttribute("aria-hidden","false");
    document.body.classList.add("modal-open");
    setTimeout(()=>vehicleName?.focus(),100);
}
function closeOrderModal(){
    orderOverlay?.classList.remove("active");
    orderOverlay?.setAttribute("aria-hidden","true");
    document.body.classList.remove("modal-open");
}

orderClose?.addEventListener("click",closeOrderModal);
orderOverlay?.addEventListener("click",e=>{if(e.target===orderOverlay)closeOrderModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeOrderModal()});
bookingDate?.addEventListener("change",()=>{
    clearError();
    if(sunday(bookingDate.value)){
        bookingDate.value="";
        showOrderError("Sundays are closed. Please choose another date.");
    }
});

function formattedDate(value){
    return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN",{weekday:"long",day:"2-digit",month:"long",year:"numeric"});
}

orderForm?.addEventListener("submit",event=>{
    event.preventDefault();
    clearError();

    if(!currentProduct){showOrderError("Product information is unavailable. Please reload the page.");return;}
    if(!vehicleName.value.trim()){showOrderError("Vehicle Name is required.");vehicleName.focus();return;}
    if(!vehicleYear.value.trim()){showOrderError("Vehicle Year is required.");vehicleYear.focus();return;}
    if(!bookingDate.value || sunday(bookingDate.value)){showOrderError("Please choose a valid booking date. Sundays are closed.");bookingDate.focus();return;}
    if(!bookingTime.value){showOrderError("Please choose a booking time.");bookingTime.focus();return;}

    const selectedTime=bookingTime.options[bookingTime.selectedIndex]?.text || bookingTime.value;
    const message=[
        "Hello CAR CRAZE! 🚗",
        "",
        "I would like to order / book:",
        `Product: ${currentProduct.name || "Not specified"}`,
        `Brand: ${currentProduct.brand || "Not specified"}`,
        `Category: ${category(currentProduct)}`,
        `Subcategory: ${currentProduct.subcategory || "Not specified"}`,
        `Price: ${price(currentProduct)}`,
        "",
        "Vehicle Information:",
        `Vehicle Name: ${vehicleName.value.trim()}`,
        `Year: ${vehicleYear.value.trim()}`,
        `Variant: ${vehicleVariant.value.trim() || "Not specified"}`,
        "",
        "Schedule Booking:",
        `Date: ${formattedDate(bookingDate.value)}`,
        `Time: ${selectedTime}`,
        "",
        `Store Location: ${LOCATION_URL}`,
        "",
        "Please confirm availability and booking."
    ].join("\n");

    const whatsappURL=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp in a new tab and keep this page visible so the customer
    // immediately sees the store location after submitting the request.
    window.open(whatsappURL,"_blank","noopener");
    closeOrderModal();
    bookingConfirmation.hidden=false;
    bookingConfirmation.scrollIntoView({behavior:"smooth",block:"start"});
});

populateTimes();
setMinDate();
loadProduct();
