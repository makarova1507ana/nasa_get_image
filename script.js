const form = document.getElementById('dateForm'); // форма для ввода дат
const resultContainer = document.querySelector('.result-container'); // контейнер, где будем размещать результаты

// Функция для получения данных от NASA API
async function get_image(key, date_) {
    const base_url = 'https://api.nasa.gov/planetary/apod';
    const api_key = '?api_key=' + key;
    const date = '&date=' + date_;
    const url = base_url + api_key + date;

    try {
        // Отправляем запрос
        const response = await fetch(url);
        // Обрабатываем ответ и преобразуем в объект
        const data = await response.json();
        // Отображаем результат
        display_img(data);
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
    }
}

// Функция для отображения изображения или видео
function display_img(data) {
    // Создаем элемент для отображения контента
    const content = document.createElement('div');
    content.className = 'content-item';

    // Отображаем картинку или видео в зависимости от типа медиа
    if (data.media_type === 'image') {
        content.innerHTML = `
            <h3>Картинка дня</h3>
            <img src='${data.url}' alt='NASA APOD'>
            <p>${data.title}</p>
            <p>${data.explanation}</p>
        `;
    } else if (data.media_type === 'video') {
        content.innerHTML = `
            <h3>Видео дня</h3>
            <iframe width="560" height="315" src="${data.url}" 
            title="YouTube video player" 
            frameborder="0" allow="accelerometer; autoplay; 
            clipboard-write; encrypted-media; gyroscope; 
            picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin" 
            allowfullscreen>
            </iframe>
            <p>${data.title}</p>
            <p>${data.explanation}</p>
        `;
    }

    // Добавляем контент в контейнер
    resultContainer.appendChild(content);
}

// Обработчик отправки формы
form.addEventListener('submit', (event) => {
    event.preventDefault(); // предотвращаем стандартное поведение формы

    const startDate = form.startDate.value; // получаем значение начальной даты
    const endDate = form.endDate.value; // получаем значение конечной даты

    const apiKey = 'jUsYymkf0vV58o8oJUSsls07GhfVpBW1HmURrBla';

    // Очищаем контейнер перед загрузкой новых данных
    resultContainer.innerHTML = '';

    if (endDate) {
        // Если задан диапазон дат, обрабатываем каждую дату в диапазоне
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Используем async/await в цикле для последовательной обработки дат
        (async() => {
            for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
                const formattedDate = date.toISOString().split('T')[0];
                await get_image(apiKey, formattedDate);
            }
        })();
    } else {
        // Если задана только одна дата
        get_image(apiKey, startDate);
    }
});
