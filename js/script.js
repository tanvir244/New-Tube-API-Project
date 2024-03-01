const btnContainer = document.getElementById('btn-container');
const cardContainer = document.getElementById('card-container');
const errorElement = document.getElementById('error-element');
const sortBtn = document.getElementById('sort-btn');

let selectedCategory = 1000;
let sortByView = false;

sortBtn.addEventListener('click', () => {
    sortByView = true;
    fetchDataByCategories(selectedCategory, sortByView);
})

const fetchCategories = () => {
    const url = 'https://openapi.programming-hero.com/api/videos/categories';
    fetch(url)
        .then((res) => res.json())
        .then(({ data }) => {
            data.forEach((card) => {
                const newBtn = document.createElement('button');
                newBtn.className = 'category-btn btn btn-ghost bg-black text-white text-xs md:text-sm';
                newBtn.innerText = card.category;
                newBtn.addEventListener('click', () => {
                    fetchDataByCategories(card.category_id);
                    const allBtn = document.querySelectorAll('.category-btn');
                    for(const btn of allBtn){
                        btn.classList.remove('bg-red-600');
                    }
                    newBtn.classList.add('bg-red-600');
                })
                btnContainer.appendChild(newBtn);
            })
        })
}
const fetchDataByCategories = (categoryID, sortByView) => {
    selectedCategory = categoryID;
    const url = `https://openapi.programming-hero.com/api/videos/category/${categoryID}`;
    fetch(url)
        .then((res) => res.json())
        .then(({ data }) => {
            // ======
            if(sortByView){
                data.sort((a, b) => {
                    const totalViewStrFirst = a.others?.views;
                    const totalViewStrSecond = b.others?.views;
                    const totalViewFirstNumber = parseFloat(totalViewStrFirst.replace("k", '')) || 0;
                    const totalViewSecondNumber = parseFloat(totalViewStrSecond.replace("k", '')) || 0;
                    return totalViewSecondNumber - totalViewFirstNumber;
                })
            }
            // ======
            if(data.length === 0){
                errorElement.classList.remove('hidden');
            }
            else{
                errorElement.classList.add('hidden');
            }
            // ======
            cardContainer.innerHTML = '';
            data.forEach((video) => {
                const newCard = document.createElement('div');
                newCard.innerHTML = `
                <div class="card card-compact bg-base-100 shadow-xl h-[330px]">
                    <figure><img class="h-[180px] w-full" src="${video.thumbnail}" />
                    </figure>
                    <div class="card-body h-[30%]">
                        <div class="flex space-x-4 justify-start items-start">
                        <div>
                            <img class="w-12 h-12 rounded-full" src="${video.authors[0].profile_picture}" alt="">
                        </div>
                        <div class="space-y-1">
                            <h2 class="card-title text-2xl">${video.title}</h2>
                            <p class="text-base font-semibold">${video.authors[0].profile_name} <span></span></p>
                            <p>${video.others.views} Views</p>
                        </div>
                        </div>
                    </div>
                </div>
            `;
            cardContainer.appendChild(newCard);
            })
        })
}

fetchCategories();
fetchDataByCategories(selectedCategory, sortByView);