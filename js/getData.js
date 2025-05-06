export const getData = async () => {

  try {
    // const response = await fetch('https://knowing-lavish-potato.glitch.me/api');
    const response = await fetch('./shedule.json');

    if (!response.ok) {
      throw new Error('HTTP Erorr! Status: ', response.status);
    }

    return await response.json();
    
  } catch (error) {
    console.error('Ошибка при получении данных: ', error);
  }

}
