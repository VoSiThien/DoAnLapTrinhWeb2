


const search = document.getElementById("search");
const matchList = document.getElementById("match-list");

// full text search function
const searchStates = async (searchText) => {
    console.log('ahjhj');
    const data = await articleModel.fullTextSearch(searchText);

    outputHtml(data);
}

// show data to html
const outputHtml = (data) => {
    if (data.length) {
        const html = data.map(val => `
            <div class="card card-body mb-1">
                <a href="/article/${val['id']}"><h5>${val['TieuDe']}</h5></a>
            </div>
        `).join('');

        matchList.innerHTML = html;

        console.log(data);
    }
}




search.addEventListener('click', () => {
    alert('sadasd');
});
