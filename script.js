const container = document.querySelector('.container');
const search = document.querySelector('#search-btn');
const cityInput = document.querySelector('#city-input');
const alertBox = document.querySelector('#alert-box');
const temp = document.querySelector('#temperature');
const pressure = document.querySelector('#pressure');
const wind = document.querySelector('#wind-speed');
const humidity = document.querySelector('#humidity');

const APIKey = 'fafb84ed9cc848fdac8eb333aa8a0266';

function animateValue(element, start, end, duration) {
    let startTime = null;

    function animation(currentTime) {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + (element.id === 'temperature' ? '°C' : element.id === 'wind-speed' ? ' km/h' : element.id === 'pressure' ? ' hPa' : '%');
        if (progress < 1) requestAnimationFrame(animation);
    }

    requestAnimationFrame(animation);
}

function fetchWeatherData() {
    const city = cityInput.value.trim();

    if (city === '') {
        alertBox.style.display = 'block';
        alertBox.classList.add('fadeIn');
        alertBox.innerText = 'Please enter a city name!';
        setTimeout(() => {
            alertBox.style.display = 'none';
            alertBox.classList.remove('fadeIn');
        }, 3000);
        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.cod !== 200) {
                alertBox.style.display = 'block';
                alertBox.classList.add('fadeIn');
                alertBox.innerText = 'City not found!';
                setTimeout(() => {
                    alertBox.style.display = 'none';
                    alertBox.classList.remove('fadeIn');
                }, 3000);
                return;
            }

            animateValue(temp, 0, Math.round(data.main.temp), 1000);
            animateValue(humidity, 0, data.main.humidity, 1000);
            animateValue(wind, 0, Math.round(data.wind.speed), 1000);
            animateValue(pressure, 0, data.main.pressure, 1000);
        })
        .catch((error) => {
            console.error('Error fetching weather data:', error);
            alertBox.style.display = 'block';
            alertBox.classList.add('fadeIn');
            alertBox.innerText = 'An error occurred while fetching data!';
            setTimeout(() => {
                alertBox.style.display = 'none';
                alertBox.classList.remove('fadeIn');
            }, 3000);
        });
}

search.addEventListener('click', fetchWeatherData);

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchWeatherData();
    }
});
