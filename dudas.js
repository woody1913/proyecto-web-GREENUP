//1
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchFaq");
    const faqItems = document.querySelectorAll(".accordion-item");
    const noResults = document.getElementById("noResults");

//2
    searchInput.addEventListener("keyup", function () {

//3
        let searchText = searchInput.value.toLowerCase().trim();
        let matches = 0;

//4
        faqItems.forEach(item => {

//5
            const button = item.querySelector(".accordion-button");
            const body = item.querySelector(".accordion-body");


            let questionText = button.innerText.toLowerCase();
            let answerText = body.innerText.toLowerCase();


            //6
            button.innerHTML = button.innerText;
            body.innerHTML = body.innerText + body.innerHTML.substring(body.innerText.length);

//7
            if (questionText.includes(searchText) || answerText.includes(searchText)) {


                item.style.display = "block";
//8 
                matches++;


                if (searchText !== "") {
                    highlightText(button, searchText);
                    highlightText(body, searchText);
                }


            } else {
                //9
                item.style.display = "none";
            }


        });

//10
        if (matches === 0) {
            noResults.classList.remove("d-none");
        } else {
            noResults.classList.add("d-none");
        }


    });

//11
    function highlightText(element, text) {
        const regex = new RegExp(`(${text})`, "gi");
        element.innerHTML = element.innerHTML.replace(regex, '<mark>$1</mark>');
    }
   
    const usefulButtons = document.querySelectorAll(".useful-btn");


    usefulButtons.forEach((button, index) => {


        const countSpan = button.nextElementSibling;


        let savedCount = localStorage.getItem("useful-" + index);
        if (savedCount) {
            countSpan.innerText = savedCount;
        }


        button.addEventListener("click", function () {


            let count = parseInt(countSpan.innerText);
            count++;


            countSpan.innerText = count;
            localStorage.setItem("useful-" + index, count);


            button.innerText = "✅ ¡Gracias por tu opinión!";
            button.disabled = true;


        });


    });


});
