// --------------------Only One Bug Remaining----------------
// if you select (for example) red and green filter and changes pixel color, then deleted the filter (any one or both by delete button) and now inserted blue filter and now if you manupulate pixel then image will become colour and that's the problem.

// ------I will add SAVE functionality later---------
// Basically I am learning it(SAVE functionality)

// Some Global Variables
let filterHtml = '';
let i = 0;
let img = new Image();
let canvas = document.getElementById('ctx');
let ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;
canvas.style.border = "2px solid"


// Function for creation of RGB filters
let filterCreation = (options, parentFilter, selectelem) => {

    Array.from(options).forEach((option) => {
        let optionValue = option.value;

        // --------------A Bug Fixed -------------------
        // When we select option in reverse order i.e first blue and then control + green(means selecting both blue and green), now if I select Red singly we will not receieve red filter in DOM(because of of loop run from red => green => blue)





        // Checking for condition how many options are selected and thus inserting corresponding Red or Green or Blue filter
        if (option.selected && document.querySelector(`.${optionValue}`) === null && i < 2) {

            // Creating A div for containing label, input and output Element
            let filterDiv = document.createElement('div');
            filterDiv.classList = `${optionValue} filter`;
            filterDiv.innerHTML = ` 
                                <label for="${optionValue}" style="color: ${optionValue};">
                                    ${optionValue} Filter
                                </label>
                                <input type="range" min="0" value="100" step="1" max="255" id="${optionValue}" sty>
                                <output for="${optionValue}">100</output>
                                <button class="delete">Delete</button>
                                `;
            parentFilter.appendChild(filterDiv);
            i++;
        }

        // Checking whether that element is not selected selected and also that it exist in DOM, so that we can remove it from DOM
        else if (!(option.selected) && !(document.querySelector(`.${optionValue}`) === null)) {
            let filterDiv = document.querySelector(`.${optionValue}`);
            filterDiv.remove();
            i--;
            console.log(i);
        };

    });
    // console.log(parentFilter.childElementCount);
    if (parentFilter.childElementCount === 2) {
        selectelem.setAttribute('disabled', 'true');
    } else {
        selectelem.removeAttribute('disabled')
    }
};

let pixelManupulate = function (filter, fIndex) {
    let colorValue = filter.children[2].innerHTML = filter.children[1].value
    let rangeId = filter.children[1].getAttribute('id');

    let imagedata1 = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let imgarr = imagedata1.data;

    for (let i = 0; i < imgarr.length; i += 4) {
        if (rangeId === "Red") {
            imgarr[i] = colorValue;
        } else if (rangeId === "Green") {
            imgarr[i + 1] = colorValue;
        } else if (rangeId === "Blue") {
            imgarr[i + 2] = colorValue;
        };
    };

    ctx.putImageData(imagedata1, 0, 0);
}

let changeCa = () => {
    let filePath = document.querySelector('[type="file"]')

    let imgElement = document.querySelector('img');
    let reader = new FileReader();

    // --------For defination of Function---------------
    // console.dir(reader.readAsDataURL);

    // ------------------------------- MUST STEP 
    reader.readAsDataURL(filePath.files[0]);
    // ------------------------------FOR READING FILES

    // Listening Onload event to insert image path(for displaying image on canvas)
    reader.onloadend = (e) => {
        imgElement.setAttribute('src', `${reader.result}`);
        img.src = `${e.target.result}`;
    };

    img.onload = () => {
        let nw = img.naturalWidth;
        let nh = img.naturalHeight;
        let aspect = nw / nh;
        let w = canvas.width;
        let h = w / aspect;
        canvas.height = h;
        console.log(canvas.height);
        ctx.drawImage(img, 0, 0, w, h);
    };

};


// Select Element selection and listening onchange event;
let parentFilter = document.querySelector('.parent-filter');
let selectelem = document.getElementById('select');
selectelem.onchange = () => {
    let options = selectelem.options;
    let optionValueArray = [];
    Array.from(options).forEach((option, ind) => {
        optionValueArray.push(option.value);
    });

    // Calling filterCreation() for putting filters into DOM
    filterCreation(options, parentFilter, selectelem);


    let filters = document.querySelectorAll('.filter');
    let outputValue = document.querySelectorAll('output');
    let filterDeleteBtn = document.querySelectorAll('.delete');

    
    filterDeleteBtn.forEach((btn, ind) => {
        btn.addEventListener('click', (e) => {
            e.currentTarget.parentElement.remove();
            if (selectelem.getAttribute('disabled')) {
                selectelem.removeAttribute('disabled');

            }
            i--;
            let strForCheckingOptionValue = e.currentTarget.previousElementSibling.getAttribute('for');
            if (optionValueArray.find(value => value.toUpperCase() === strForCheckingOptionValue.toUpperCase())) {
                let option = document.querySelector(`[value=${strForCheckingOptionValue}]`);
                option.selected = false;
            };
        })
    })

    filters.forEach((filter, fIndex) => {
        filter.children[1].addEventListener('input', () => {
            pixelManupulate(filter, fIndex)
        })
    });

};