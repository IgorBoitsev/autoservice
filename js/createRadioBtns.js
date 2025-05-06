export const createRadioBtns = (radioWrapperSelector, name, radioData) => {

  const radioWrapper = document.querySelector(radioWrapperSelector);
  radioWrapper.textContent = '';

  radioData.forEach(radioItem => {
    const radioDiv = document.createElement('div');
    radioDiv.className = 'radio';

    const raduoInput = document.createElement('input');
    raduoInput.className = 'radio__input';
    raduoInput.type = 'radio';
    raduoInput.name = name;
    raduoInput.id = radioItem.value;
    raduoInput.value = radioItem.value;

    const radioLabel = document.createElement('label');
    radioLabel.className = 'radio__label';
    radioLabel.htmlFor = radioItem.value;
    radioLabel.textContent = radioItem.title;

    radioDiv.append(raduoInput, radioLabel);
    radioWrapper.append(radioDiv);
  });
  
}
