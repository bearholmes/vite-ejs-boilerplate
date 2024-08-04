module.exports = {
  /**
   * @description 큰따옴표 대신 작은따옴표를 사용함(true일 경우)
   * @see https://prettier.io/docs/en/options.html#quotes
   */
  singleQuote: true,
    /**
     * @description 문장의 끝에 세미콜론을 인쇄합니다.
     * @see https://prettier.io/docs/en/options.html#semicolons
     */
    semi: true,
  /**
   * @description 탭 사용 여부를 지정합니다.
   * @see https://prettier.io/docs/en/options.html#use-tabs
   */
  useTabs: false,
  /**
   * @description 문장의 들여쓰기 공백 수를 지정합니다.
   * @see https://prettier.io/docs/en/options.html#tab-width
   */
  tabWidth: 2,
  /**
   * @description 여러 줄의 쉼표로 구분된 구문 구조에서 가능하면 후행 쉼표를 인쇄합니다.(ex none 일경우 인쇄하지 않음)
   * @see https://prettier.io/docs/en/options.html#trailing-commas
   */
  trailingComma: 'none',
  /**
   * @description 문장의 래핑할 최대 길이를 지정합니다.
   * @see https://prettier.io/docs/en/options.html#print-width
   */
  printWidth: 80,
  /**
   * @description 객체 리터럴의 대괄호 사이에 공백을 인쇄합니다.
   * @see https://prettier.io/docs/en/options.html#bracket-spacing
   */
  bracketSpacing: true,
  /**
   * @description 유일한 화살표 함수 매개변수 주위에 괄호를 포함합니다.(avoid일 경우 포함하지 않음)
   * @see https://prettier.io/docs/en/options.html#arrow-function-parentheses
   */
  arrowParens: 'avoid',
  /**
   * @description 여러줄의 HTML (HTML, JSX, Vue, Angular)을 작성하는 경우 닫는 '>'를 새로운 줄에 추가합니다.
   * @see https://prettier.io/docs/en/options.html#bracket-line
   */
  bracketSameLine: true,
  /**
   * @description HTML, JSX에서 한 줄에 단일 속성을 적용합니다.
   * @see https://prettier.io/docs/en/options.html#single-attribute-per-line
   */
  singleAttributePerLine: true
}
