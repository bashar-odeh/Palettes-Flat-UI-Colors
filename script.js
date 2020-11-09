const colorDivs = document.querySelectorAll(".color");
const generatbtn = document.querySelector(".generate");
const sliders = document.querySelectorAll("input[type='range']");
const currentHex = document.querySelector('.color h2');
const adjust = document.querySelectorAll(".adjust");
const closeAdjustment = document.querySelectorAll(".close-adjustment");
const lock = document.querySelectorAll(".lock");
let arrayOfColors;
const allHexes = document.querySelectorAll(".color h2");
const library = document.querySelector(".library");
const save = document.querySelector(".save");
const submitSave = document.querySelector(".submit-save");



//EventListners

lock.forEach((lock) => {
    lock.addEventListener("click", (e) => {
        if (lock.classList.contains("open")) {
            e.target.innerHTML = '<i class="fa fa-lock"></i>';
            e.target.classList.remove("open");
            e.target.classList.add("close");
            e.target.parentElement.children[0].style.pointerEvents = "none";

        } else {
            e.target.innerHTML = '<i class="fas fa-lock-open"></i>';
            e.target.classList.add("open");
            e.target.classList.remove("close");
            e.target.parentElement.children[0].style.pointerEvents = "all";
        }

    });

});
generatbtn.addEventListener("click", () => {
    randomColors();
});


closeAdjustment.forEach((button) => {
    button.addEventListener("click", (e) => {
        e.target.parentElement.classList.remove("active");
        e.target.parentElement.style.pointerEvents = "none";
        console.log(e.target.parentElement.querySelector(".close-adjustment"));
        e.target.parentElement.querySelector(".close-adjustment").style.pointerEvents = "none";
    });
});

adjust.forEach((button) => {

    button.addEventListener("click", (e) => {
        const allDivsSliders = document.querySelectorAll(".sliders");
        allDivsSliders.forEach((divSlider) => {
            if ((divSlider.isSameNode(e.target.parentElement.parentElement.childNodes[5]))) {
                divSlider.querySelector(".close-adjustment").style.pointerEvents = "all"
                divSlider.style.pointerEvents = "all";
                divSlider.classList.toggle("active");
            }
        });
    });
});

allHexes.forEach((hex) => {
    hex.addEventListener("click", () => {
        copyToClipBoard(hex);
    })
})
library.addEventListener("click", openLibrary);
save.addEventListener("click", openSavePanel);
submitSave.addEventListener("click", storeAtLocalStorage)
    //Functions
function generateColor() {
    return chroma.random();
}

function randomColors() {
    arrayOfColors = [];
    colorDivs.forEach((div) => {
        if (div.children[1].children[1].classList.contains("open")) {

            //Generate a color 
            const generatedColor = generateColor();
            // put the name of the color and color the div 
            div.children[0].innerText = generatedColor;
            div.style.backgroundColor = generatedColor;

            // check if the contrast of the color is sutable for the background color (generated color)
            const color = chroma(generatedColor);
            arrayOfColors.push(color.hex());
            //add Events to the sliders
            slidersInput(div, generatedColor);
            changeSpanColorOfTheSliders(div, generatedColor);
            const sliders = div.querySelectorAll(".sliders input");
            //last code {}
            checkTextContrast(color, div.children[0]);
            // sliders[0] Hue 
            //sliders[1] Brightness
            //sliders[2] sat
            colorizeSliders(color, sliders[0], sliders[1], sliders[2]);

        } else {}
    });

    resetColors();
};

function checkTextContrast(color, text) {
    const luminance = chroma(color).luminance();
    if (luminance > 0.5) {
        text.style.color = "black";
    } else {
        text.style.color = "white";
    }
};

function colorizeSliders(color, hue, brightness, sat) {

    const scalseSat = chroma.scale([color.set("hsl.s", 0), color, color.set("hsl.s", 1)]);
    sat.style.backgroundImage = `linear-gradient(to right,${scalseSat(0)},${scalseSat(1)})`;

    const scalsebtight = chroma.scale(["black", color.set("hsl.l", 0.5), "white"]);
    brightness.style.backgroundImage = `linear-gradient(to right,${scalsebtight(0)},${scalsebtight(0.5)},${scalsebtight(1)})`;

    hue.style.backgroundImage = "linear-gradient(to right,rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))";
    // put the right value for the sliders ;
    sat.value = color.get('hsl.s');
    brightness.value = color.get('hsl.l');

}

function changeSpanColorOfTheSliders(div, color) {
    const allSpan = div.querySelectorAll(".sliders span");

    allSpan.forEach((span) => {

        if (color.Hex !== "#FFFFFF") {
            span.style.color = color;
        } else {
            span.style.color = "black";
        }
    });
}

function slidersInput(div, color) {
    const divSlider = div.querySelectorAll(".sliders input");
    divSlider.forEach((slider) => {
        slider.addEventListener("input", (e) => {
            let index = e.target.getAttribute("data-sat") || e.target.getAttribute("data-hue") || e.target.getAttribute("data-bright");
            bgColor = arrayOfColors[index];
            let color = chroma(bgColor)
                .set('hsl.h', divSlider[0].value)
                .set('hsl.l', divSlider[1].value)
                .set('hsl.s', divSlider[2].value);
            div.style.backgroundColor = color;
            let h2 = div.querySelector("h2");
            h2.innerText = color;
            checkTextContrast(color, h2);
            const btn = div.querySelectorAll(".controls button");
            btn.forEach((btn) => {
                checkTextContrast(color, btn);
            });
            colorizeSliders(color, divSlider[0], divSlider[1], divSlider[2]);
        })
    })
}

function resetColors() {


    const sliders = document.querySelectorAll(".sliders input");
    console.log(arrayOfColors)
    sliders.forEach((slider) => {
        if (slider.name === "hue") {

            slider.value = chroma(arrayOfColors[slider.getAttribute("data-hue")]).hsl()[0];

        }
        if (slider.name === "brightness") {
            slider.value = chroma(arrayOfColors[slider.getAttribute("data-bright")]).hsl()[2];
            console.log(arrayOfColors[slider.getAttribute("data-bright")], slider.getAttribute("data-bright"));
            console.log(chroma(arrayOfColors[slider.getAttribute("data-bright")]).hsl()[2]);
            slider.value = Math.floor(slider.value * 100) / 100;

        }
        if (slider.name === "sat") {
            slider.value = chroma(arrayOfColors[slider.getAttribute("data-sat")]).hsl()[1];
            slider.value = Math.floor(slider.value * 100) / 100;
        }
    })

}

function copyToClipBoard(hex) {
    const el = document.createElement("textarea");
    el.value = hex.innerText;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    const getContainer = document.querySelector(".copy-container");
    const getPopup = document.querySelector(".copy-popup ");
    getContainer.classList.add("active");
    getPopup.classList.add("active");
    getPopup.addEventListener("transitionend", () => {
        setTimeout(function() {
            getContainer.classList.remove("active");
            getPopup.classList.remove("active");
        }, 300)
    });

}

function openLibrary() {
    const libraryContainer = document.querySelector(".library-container");
    console.log(libraryContainer.children[0].classList);
    if (!libraryContainer.classList.contains("active")) {
        libraryContainer.classList.add("active");
        libraryContainer.children[0].classList.add("active");
        const mainDiv = document.querySelector(".mainDiv");
        if ((mainDiv !== null)) {
            mainDiv.remove();
        }

    }
    const closeLibrary = document.querySelector(".close-library");
    closeLibrary.addEventListener("click", () => {

        libraryContainer.classList.remove("active");
        libraryContainer.children[0].classList.remove("active");
    })
    fillLibrary();

}

function openSavePanel() {
    const saveContainer = document.querySelector(".save-container");

    if (!saveContainer.classList.contains("active")) {
        saveContainer.classList.add("active");
        saveContainer.children[0].classList.add("active");
    }
    const closesave = document.querySelector(".close-save");
    closesave.addEventListener("click", () => {
        saveContainer.classList.remove("active");
        saveContainer.children[0].classList.remove("active");
    })
}

function fillLibrary() {

    const myObj = {
        libraryName: null,
        colors: null
    };

    const libraryPopup = document.querySelector(".library-popup");
    const mainDiv = document.createElement("div");
    mainDiv.classList.add("mainDiv");
    keys = Object.keys(localStorage);
    keys.forEach((key) => {

        myObj.libraryName = key;
        myObj.colors = JSON.parse(localStorage.getItem(key));
        //create main div to easily refresh the whole list 

        // creating and adding library div
        const LirbraryDiv = document.createElement("div");
        LirbraryDiv.classList.add("Lirbrary-div");
        mainDiv.appendChild(LirbraryDiv);

        //  creating and adding span name
        const spanName = document.createElement("span");
        spanName.innerText = myObj.libraryName;
        spanName.classList.add("name");
        LirbraryDiv.appendChild(spanName);
        const applyButton = document.createElement("button");
        applyButton.innerText = "apply";

        applyButton.addEventListener("click", (e) => {


            myColors = JSON.parse(localStorage.getItem(e.target.previousSibling.innerText))
            for (var i = 0; i < 5; i++) {

                colorDivs[i].style.backgroundColor = chroma(myColors[i]);
                colorDivs[i].children[0].innerText = myColors[i]
                const sliders = colorDivs[i].querySelectorAll(".sliders input");
                colorizeSliders(chroma(myColors[i]), sliders[0], sliders[1], sliders[2]);

            }
            arrayOfColors = myColors
            resetColors();



        });

        LirbraryDiv.appendChild(applyButton);
        myObj.colors.forEach(color => {
            const div = document.createElement("div");
            div.style.backgroundColor = chroma(color);
            div.classList.add("library-colors-specs");
            LirbraryDiv.appendChild(div);
        });
        libraryPopup.appendChild(mainDiv);

    });
}

function storeAtLocalStorage() {
    const inputText = document.querySelector("#name");
    const allHexesValues = [];
    allHexes.forEach(hex => {
        allHexesValues.push(hex.innerText);
    });
    localStorage.setItem(inputText.value, JSON.stringify(allHexesValues));
    //close save
    const saveContainer = document.querySelector(".save-container");
    saveContainer.classList.remove("active");
    saveContainer.children[0].classList.remove("active");
}
randomColors();