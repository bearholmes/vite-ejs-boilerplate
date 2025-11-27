/**
 * 간단한 카운터 버튼 초기화.
 * @param {HTMLElement} element 버튼 요소
 */
function setupCounter(element) {
  let counter = 0;
  const setCounter = (count) => {
    counter = count;
    element.innerHTML = `count is ${counter}`;
  };
  element.addEventListener('click', () => setCounter(counter + 1));
  setCounter(0);
}

const element = document.querySelector('#counter');
if (element) {
  setupCounter(element);
}
