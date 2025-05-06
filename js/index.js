import { getData } from "./getData.js";
import { createRadioBtns } from "./createRadioBtns.js";

const form = document.querySelector('.form');
const formBtnPrev = document.querySelector('.form__btn_prev');
const formBtnNext = document.querySelector('.form__btn_next');
const formBtnSubmit = document.querySelector('.form__btn_submit');
const formTime = document.querySelector('.form__time');
const formMonths = document.querySelector('.form__months');
const formFieldsetClient = document.querySelector('.form__fieldset_client');
const formFieldsetType = document.querySelector('.form__fieldset_type');
const formFieldsetDate = document.querySelector('.form__fieldset_date');
const formFieldsets = [formFieldsetType, formFieldsetDate, formFieldsetClient];
const formInfoType = document.querySelector('.form__info_type');
const formInfoDate = document.querySelector('.form__info-date');
// const formInfoDataDay = document.querySelector('.form__info-data-day');
// const formInfoDataTime = document.querySelector('.form__info-data-time');

const currentMonth = new Intl.DateTimeFormat('ru-RU', {month: 'long'}).format(new Date());

let chosenMonth = currentMonth;
let currentStep = 0;

const data = await getData();

const dataToWrite = {
  dataType: '',
  dataTitle: '',
  day: '',
  time: ''
};

const allMonth = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];

const showResultData = () => {
  const currentYear = new Date().getFullYear();
  const monthIndex = allMonth.findIndex(item => item === chosenMonth);
  const dateString = `${currentYear}-${dataToWrite.day.toString().padStart(2, '0')}-${(monthIndex + 1).toString().padStart(2, '0')}T${dataToWrite.time}`

  const dateObj = new Date(dateString);

  const formattedDate = dateObj.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit'
  });

  formInfoType.textContent = dataToWrite.dataTitle;
  formInfoDate.innerHTML = `
    <span class="form__info-data-day">${formattedDate}</span> 
    <span class="form__info-data-time">${dataToWrite.time}</span>`;
  formInfoDate.datetime = dateString;
}

const updateFieldsetVisibility = () => {
  formFieldsets.forEach((fieldset, index) => {
    if (index === currentStep) {
      fieldset.classList.add('form__fieldset_active');
    } else {
      fieldset.classList.remove('form__fieldset_active');
    }
  });
  
  if (currentStep === 0) {
    formBtnPrev.style.display = 'none';
    formBtnNext.style.display = 'flex';
    formBtnSubmit.style.display = 'none';
  } else if (currentStep === formFieldsets.length - 1) {
    formBtnPrev.style.display = 'flex';
    formBtnNext.style.display = 'none';
    formBtnSubmit.style.display = 'flex';

    showResultData();
  } else {
    formBtnPrev.style.display = 'flex';
    formBtnNext.style.display = 'flex';
    formBtnSubmit.style.display = 'none';
  }    
};

const createFormTime = (date, day) => {
  const objectMonth = date.find(item => item.month === chosenMonth);
  const days = objectMonth.day;
  const daysData = days[day].map(item => ({
    value: `${item}:00`,
    title: `${item}:00`
  }))

  createRadioBtns('.form__radio-wrapper_time', 'time', daysData);
  formTime.style.display = 'block';
};

const createFormDays = (date) => {
  const objectMonth = date.find(item => item.month === chosenMonth);
  const days = Object.keys(objectMonth.day);
  
  const typeData = days.map(item => ({
    value: item,
    title: item
  }));

  createRadioBtns('.form__radio-wrapper_day', 'day', typeData);
};

const createFormMonths = (months) => {
  formMonths.textContent = '';
  const buttonsMonth = months.map(item => {
    const btn = document.createElement('button');
    btn.className = 'form__btn-months';
    btn.type = 'button';
    btn.textContent = item[0].toUpperCase() + item.substring(1).toLowerCase();

    if (item === chosenMonth) {
      btn.classList.add('form__btn-months_active');
    }

    return btn;
  });

  formMonths.append(...buttonsMonth);

  buttonsMonth.forEach(btn => {
    btn.addEventListener('click', ({ target }) => {
      if (target.classList.contains('form__btn-months_active')) {
        return;
      };
      buttonsMonth.forEach(btn => {
        btn.classList.remove('form__btn-months_active');
      });

      target.classList.add('form__btn-months_active');

      chosenMonth = target.textContent.toLowerCase();

      const date = data.find(item => item.type === dataToWrite.dataType).date;
      createFormDays(date);
    })
  })
};

const handleInputForm = ({ target, currentTarget }) => {
  if (currentTarget.type.value && currentStep === 0) {
    formBtnNext.disabled = false;

    const workTypeDate = data.find(item => item.type === currentTarget.type.value).date;
    const workTypeMonths = workTypeDate.map(item => item.month);

    dataToWrite.dataTitle = target.nextElementSibling.textContent;
    dataToWrite.dataType = currentTarget.type.value;
    
    createFormMonths(workTypeMonths);
    createFormDays(workTypeDate);
  }

  if (currentStep === 1) {
    if (currentTarget.day.value && target.name === 'day') {
      dataToWrite.day = currentTarget.day.value;

      const date = data.find(item => item.type === dataToWrite.dataType).date;
      createFormTime(date, dataToWrite.day);
    }

    if (currentTarget.time.value && target.name === 'time') {
      dataToWrite.time = currentTarget.time.value;
      formBtnNext.disabled = false;
    } else {
      formBtnNext.disabled = true;
    }
  }

  if (currentStep === 2) {
    const inputs = formFieldsetClient.querySelectorAll('.form__input');
    let allFilled = true;

    inputs.forEach(input => {
      if (input.value.trim() === '') {
        allFilled = false;
      }
    });

    formBtnSubmit.disabled = !allFilled;
  }
};

const typeData = data.map(item => ({
  value: item.type,
  title: item.title
}));
createRadioBtns('.form__radio-wrapper_type', 'type', typeData);

formBtnNext.disabled = true;

formBtnNext.addEventListener('click', () => {
  if (currentStep < formFieldsets.length - 1) {
    currentStep += 1;
    updateFieldsetVisibility();
    formBtnNext.disabled = true;
    formBtnSubmit.disabled = true;
  }
});

formBtnPrev.addEventListener('click', () => {
  if (currentStep > 0) {
    currentStep -= 1;
    updateFieldsetVisibility();
    formBtnNext.disabled = false;
  }
});

form.addEventListener('input', handleInputForm);
form.addEventListener('submit', async e => {
  e.preventDefault();

  const formData = new FormData(form);

  const formDataObject = Object.fromEntries(formData);
  formDataObject.month = chosenMonth;
  
  try {
    const response = await fetch('https://knowing-lavish-potato.glitch.me/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formDataObject)
    });

    if (response.ok) {
      // alert('Данные успешно отправлены');
      form.innerHTML = '<h2>Данные успешно отправлены</h2>';
    } else {
      throw new Error('Ошибка при отправке данных: ', response.status);
    }    
  } catch (error) {
    console.error('Ошибка при отправке запроса: ', error);
  }
});

updateFieldsetVisibility();