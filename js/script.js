const template = document.querySelector("#myTemp").content;
const nav = document.querySelector("div.nav");
const allLink = document.querySelector("#all");
let main = document.querySelector("main");
const modal = document.querySelector(".bg-modal");

const closeBtn = document.querySelector("#close");

const imgLink = "https;//kea-alt-del.dk/t5/site/imgs/";
const pLink = "https://kea-alt-del.dk/t5/api/product?id=";

allLink.addEventListener("click", () => showCategory("all"));

fetch("http://kea-alt-del.dk/t5/api/categories").then(e => e.json()).then(data => createCatSection(data));

closeBtn.addEventListener("click", () => modal.classList.add("hide"));





function createCatSection(categories) {
    categories.forEach(cat => {
        const newSection = document.createElement("section");
        const newHeader = document.createElement("h3");
        const newA = document.createElement("a");
        newA.textContent = cat;
        newA.href = "#";
        newA.addEventListener("click", () => showCategory(cat));
        newSection.id = cat;
        newHeader.textContent = cat;
        main.appendChild(newHeader);
        main.appendChild(newSection);
        nav.appendChild(newA);

    })

    fetch("http://kea-alt-del.dk/t5/api/productlist").then(e => e.json()).then(data => data.forEach(showData));
}

function showCategory(category) {
    document.querySelectorAll("main section").forEach(section => {
        if (section.id == category || category == "all") {
            section.style.display = "grid";
            section.previousElementSibling.style.display = "block"
        } else {
            section.style.display = "none";
            section.previousElementSibling.style.display = "none"
        }
    })

}

function showDetails(id) {
    console.log(id);

    modal.querySelector("h4.modal-name").textContent = id.name;
    if (id.soldout) {
        modal.querySelector("h5.modal-price").textContent = "SOLD OUT";
        modal.querySelector("h5.modal-price").classList.remove("discount");
        modal.querySelector("h5.modal-price").classList.add("soldouth");
        modal.querySelector("h5.modal-oldPrice").classList.add("hide");
    } else if (id.discount > 0) {
        modal.querySelector("h5.modal-price").textContent = "Discount! " + Math.round(id.price * (1 - id.discount / 100)) + ",- DKK";
        modal.querySelector("h5.modal-oldPrice").textContent = "Old Price: " + id.price + ", -DKK";
        modal.querySelector("h5.modal-price").classList.add("discount");
        modal.querySelector("h5.modal-oldPrice").classList.remove("hide");
    } else {
        modal.querySelector("h5.modal-price").textContent = id.price + ",- DKK";
        modal.querySelector("h5.modal-oldPrice").classList.add("hide");
        modal.querySelector("h5.modal-price").classList.remove("discount");
    }
    if (id.vegetarian) {
        modal.querySelector("h6.modal-veg").textContent = "Vegetarian";
    } else {
        modal.querySelector("h6.modal-veg").classList.add("hide");
    }
    if (id.alcohol > 0) {
        modal.querySelector("h6.modal-alc").textContent = "Alc.: " + id.alcohol + " %";
    } else {
        modal.querySelector("h6.modal-alc").classList.add("hide");
    }
    if (id.region) {
        modal.querySelector("h6.modal-reg").textContent = "Region: " + id.region;
    } else {
        modal.querySelector("h6.modal-reg").textContent = "Region: unknown";
    }
    if (id.allergens.length) {
        modal.querySelector("h6.modal-aller").textContent = "Allergens: "
        modal.querySelector("h6.modal-aller").textContent += id.allergens[0];
        for (let i = 1; i<id.allergens.length; i++) {
            modal.querySelector("h6.modal-aller").textContent += ", " + id.allergens[i];
        }
    } else {
        modal.querySelector("h6.modal-aller").textContent = "Allergens: none";
    }
    modal.querySelector("img.modal-img").src = "https://kea-alt-del.dk/t5/site/imgs/large/" + id.image + ".jpg";
    modal.querySelector("img.modal-img").alt = id.image;


    if (id.longdescription) {
        modal.querySelector("p.modal-de").textContent = id.longdescription;
    } else {
        modal.querySelector("p.modal-de").textContent = id.shortdescription;
    }

    modal.classList.remove("hide");
}



function showData(oneObject) {

    const section = document.querySelector("#" + oneObject.category);
    let clone = template.cloneNode(true);

    clone.querySelector("h4").textContent = oneObject.name;

    if (oneObject.soldout) {
        clone.querySelector("h5").textContent = "SOLD OUT";
        clone.querySelector("img").classList.add("soldout");
        clone.querySelector("h5").classList.add("soldouth");
    } else if (oneObject.discount) {
        clone.querySelector("h5").textContent = "Discount! " + Math.round(oneObject.price * (1 - oneObject.discount / 100)) + ",- DKK";
        clone.querySelector("h5").classList.add("discount");
    } else {
        clone.querySelector("h5").textContent = oneObject.price + ",- DKK";
    }

    clone.querySelector("img").src = "https://kea-alt-del.dk/t5/site/imgs/medium/" + oneObject.image + "-md.jpg";
    clone.querySelector("img").alt = oneObject.image;

    clone.querySelector("button").addEventListener("click", () => {
        fetch(pLink + oneObject.id).then(e => e.json()).then(data => showDetails(data));
    });

    clone.querySelector("p").textContent = oneObject.shortdescription;


    if (oneObject.vegetarian == true) {
        clone.querySelector("h6.veg").textContent = "Vegetarian";
    } else {
        clone.querySelector("h6.veg").classList.add("hide");
    }

    if (oneObject.alcohol > 0) {
        clone.querySelector("h6.alc").textContent = "Alc.: " + oneObject.alcohol + " %";
    } else {
        clone.querySelector("h6.alc").classList.add("hide");
    }


    section.appendChild(clone);
}
