// Функция для отправки запроса к API и отображения результатов
function searchMovies(title, type, page) {
    // Очищаем предыдущие результаты
    document.getElementById('movies').innerHTML = '';

    // Формируем URL запроса к API
    var url = 'https://www.omdbapi.com/?s=' + encodeURIComponent(title) + '&type=' + encodeURIComponent(type) + '&page=' + page + '&apikey=fbeb0605';

    // Отправляем AJAX-запрос
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.Response === 'True') {
                // Если фильмы найдены, отображаем их
                var movies = response.Search;
                for (var i = 0; i < movies.length; i++) {
                    displayMovie(movies[i]);
                }

                // Создаем кнопки пагинации
                var pagination = document.createElement('div');
                pagination.classList.add('pagination');

                // Проверяем, есть ли предыдущая страница
                if (response.totalResults > 10 && page > 1) {
                    var prevButton = document.createElement('button');
                    prevButton.textContent = 'Предыдущий';
                    prevButton.addEventListener('click', function() {
                        searchMovies(title, type, page - 1);
                    });
                    pagination.appendChild(prevButton);
                }

                // Проверяем, есть ли следующая страница
                if (response.totalResults > page * 10) {
                    var nextButton = document.createElement('button');
                    nextButton.textContent = 'Следующий';
                    nextButton.addEventListener('click', function() {
                        searchMovies(title, type, page + 1);
                    });
                    pagination.appendChild(nextButton);
                }

                // Добавляем блок пагинации на страницу
                document.getElementById('movies').appendChild(pagination);
            } else {
                // Если фильмы не найдены, выводим сообщение
                document.getElementById('movies').textContent = 'Фильм не найден!';
            }
        } else {
            console.log('Error: ' + xhr.status);
        }
    };
    xhr.send();
}

// Функция для получения детальной информации о фильме по его идентификатору
function fetchMovieDetails(imdbID) {
    var url = 'https://www.omdbapi.com/?i=' + encodeURIComponent(imdbID) + '&apikey=fbeb0605';

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);

            // Выводим детальную информацию о фильме или сообщение об ошибке
            if (response.Response === 'True') {
                var movieDetails = 'Title: ' + response.Title + '\nYear: ' + response.Year + '\nGenre: ' + response.Genre + '\nDirector: ' + response.Director;
                displayMovieDetails(response);
            } else {
                alert('Error: ' + response.Error);
            }
        } else {
            console.log('Error: ' + xhr.status);
        }
    };
    xhr.send();
}

// Функция для отображения карточки фильма
function displayMovie(movie) {
    var movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');

    var poster = document.createElement('img');
    poster.classList.add('movie-poster');
    poster.src = movie.Poster;
    movieCard.appendChild(poster);

    var details = document.createElement('div');
    details.classList.add('movie-details');

    var title = document.createElement('h3');
    title.classList.add('movie-title');
    title.textContent = movie.Title;
    details.appendChild(title);

    var year = document.createElement('p');
    year.classList.add('movie-year');
    year.textContent = "Год выпуска: " + movie.Year;
    details.appendChild(year);

    var detailsButton = document.createElement('button');
    detailsButton.textContent = 'Подробнее';
    detailsButton.classList.add('details-button');
    detailsButton.addEventListener('click', function() {
        fetchMovieDetails(movie.imdbID);
    });
    details.appendChild(detailsButton);

    movieCard.appendChild(details);
    document.getElementById('movies').appendChild(movieCard);
}
function displayMovieDetails(response) {
    // Создаем контейнер и маску для модального окна
    var modal = document.createElement('div');
    modal.classList.add('modal');

    var modalMask = document.createElement('div');
    modalMask.classList.add('modal-mask');
    modal.appendChild(modalMask);

    // Создаем основное содержимое модального окна
    var modalWrapper = document.createElement('div');
    modalWrapper.classList.add('modal-wrapper');

    var movieCard = document.createElement('div');
    movieCard.classList.add('movie-details-card');

    var poster = document.createElement('img');
    poster.classList.add('movie-details-poster');
    poster.src = response.Poster;
    movieCard.appendChild(poster);

    var details = document.createElement('div');
    details.classList.add('movie-details-content');

    var title = document.createElement('h3');
    title.textContent = response.Title;
    details.appendChild(title);

    var year = document.createElement('p');
    year.textContent = "Год выпуска: " + response.Year;
    details.appendChild(year);

    var genre = document.createElement('p');
    genre.textContent = "Жанр: " + response.Genre;
    details.appendChild(genre);

    var director = document.createElement('p');
    director.textContent = "Режиссер: " + response.Director;
    details.appendChild(director);

    var plot = document.createElement('p');
    plot.textContent = "Сюжет: " + response.Plot;
    details.appendChild(plot);

    var closeButton = document.createElement('button');
    closeButton.textContent = 'Закрыть';
    closeButton.classList.add('close-button');
    closeButton.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    details.appendChild(closeButton);

    movieCard.appendChild(details);
    modalWrapper.appendChild(movieCard);
    modal.appendChild(modalWrapper);

    // Добавляем модальное окно на страницу
    document.body.appendChild(modal);
}

// Обрабатываем отправку формы
document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();

    var title = document.getElementById('movie-title').value;
    var type = document.getElementById('movie-type').value;
    var currentPage = 1;

    if (title.length > 0) {
        searchMovies(title, type, currentPage);
    } else {
        alert('Пожалуйста, введите название фильма.');
    }
});
 