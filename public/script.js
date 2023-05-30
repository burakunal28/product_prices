window.onload = () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsDiv = document.getElementById('resultsDiv');

    searchButton.addEventListener('click', async () => {
        const brand = searchInput.value;
        const response = await fetch('/getCheapestProducts?brand=' + brand);
        const productItems = await response.json();

        resultsDiv.innerHTML = '';
        productItems.forEach(item => {
            const itemDiv = document.createElement('div');
            const itemName = document.createElement('p');
            itemName.textContent = `${item.name}: ${item.price} TL`;
            const itemButton = document.createElement('button');
            itemButton.textContent = 'Ürüne Git';
            itemButton.addEventListener('click', () => window.open(item.link, '_blank'));
            itemDiv.appendChild(itemName);
            itemDiv.appendChild(itemButton);
            resultsDiv.appendChild(itemDiv);
        });
    });
};
