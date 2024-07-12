
const denominations = [100, 200, 500, 1000, 2000, 5000]; // Константа с номиналом купюр 
let cassetteCount = 0; // Переменная с количеством касет

function addCassette() {
    // Функция добавления касеты в банкомат

    if (cassetteCount >= 8) return;
    cassetteCount++;
    let cassetteDiv = document.createElement('div'); // Переменная с элементом HTML для добавления касет
    cassetteDiv.className = 'cassette';
    cassetteDiv.innerHTML = `
        <label>Номинал кассеты ${cassetteCount}:</label>
        <select class="denomination">
            ${denominations.map(d => `<option value="${d}">${d} руб</option>`).join('')}
        </select>
        <label>Количество купюр:</label>
        <input type="number" class="count" min="0" value="0">
        <label>Статус:</label>
        <select class="status">
            <option value="исправна">исправна</option>
            <option value="неисправна">неисправна</option>
        </select>
    `;
    document.getElementById('cassettes').appendChild(cassetteDiv);
}

function removeCassette() {
    // Функция удаления касеты

    if (cassetteCount <= 1) return;
    let cassettes = document.getElementById('cassettes'); // Переменная с касетами
    cassettes.removeChild(cassettes.lastChild);
    cassetteCount--;
}

function calculate() {
    // Функция для расчетов купюр по введенной сумме

    let amount = parseInt(document.getElementById('amount').value, 10); // Переменная с введенной суммой пользователя
    if (isNaN(amount) || amount <= 0) {
        alert('Пожалуйста, введите корректную сумму.');
        return;
    }

    let cassettes = document.querySelectorAll('.cassette'); // Переменная с данными всех касет
    let cassetteData = []; // Переменная для данных касет номинал, количество
    cassettes.forEach(cassette => {
        let denomination = parseInt(cassette.querySelector('.denomination').value, 10); // Переменная с номиналом купюр касеты
        let count = parseInt(cassette.querySelector('.count').value, 10); // Переменная с количеством купюр касеты
        let status = cassette.querySelector('.status').value; // Переменная со статусом касеты
        if (status === 'исправна') {
            cassetteData.push({ denomination, count });
        }
    });

    let startTime = performance.now(); // Переменная с временем начала
    let result = dispenseAmount(amount, cassetteData); // Переменная с результатом вычислений
    let endTime = performance.now(); // Переменная с временем окончания
    let timeTaken = endTime - startTime; // Переменная с итоговым временем

    let resultDiv = document.getElementById('result'); // Переменная с элементом HTML для результата вычислений
    resultDiv.innerHTML = '';
    if (result.success) {
        resultDiv.innerHTML = `Сумма может быть выдана:<br>`;
        result.details.forEach(detail => {
            resultDiv.innerHTML += `${detail.count} купюр номиналом ${detail.denomination} руб<br>`;
        });
    } else {
        resultDiv.innerHTML = 'Невозможно выдать указанную сумму.';
    }
    resultDiv.innerHTML += `<br>Время вычисления: ${timeTaken.toFixed(2)} мс`;
}

function dispenseAmount(amount, cassettes) {
    // Функция для вычисления выдаваемых купюр
    
    cassettes.sort((a, b) => b.denomination - a.denomination);
    let details = []; // Переменная со всем количеством касет (номинал, количество) для выдаче пользователю 
    for (let cassette of cassettes) {
        if (amount >= cassette.denomination && cassette.count > 0) {
            let count = Math.min(Math.floor(amount / cassette.denomination), cassette.count); // Переменная с количеством купюры определенного номинала
            amount -= count * cassette.denomination;
            details.push({ denomination: cassette.denomination, count });
        }
    }
    return { success: amount === 0, details };
}

// Инициализация первой кассеты
addCassette();
