# QuickTip
Библиотека QuickTip “быстрые подсказки” создавалась независимой и поэтому не помешает ни одной технологии, используемой в проекте такие как (Vue.js, React.js, Angular.js, jQuery), так как была написана на чистом JavaScript. 

## Быстрый старт QuickTip
Перед началом работы создайте свой template и добавьте его в конструктор.
Установите id идентификаторы на важные поля, чтобы QuickTip мог работать с вашим template:

```javascript
    const template = `
        <div class="quick-tip-block">
            <div id="quick-tip-tail" class="quick-tip-tail"></div>
            <div class="quick-tip-head">
                <div id="quick-tip-title" class="quick-tip-title">Меню</div>
                <div class="quick-tip-indicator">
                    <i id="quick-tip-previous" class="fa fa-chevron-left" aria-hidden="true"></i>
                    <span id="quick-tip-indicator">1 из 3</span>
                </div>
            </div>
            <div id="quick-tip-text" class="quick-tip-text">Кнопка входа</div>
            <div class="quick-tip-footer">
                <a href="#" id="quick-tip-stop">Пропустить</a>
                <button id="quick-tip-next">Далее</button>
            </div>
        </div>`;

    // С одним параметром второй параметр не обязателен
    // const quickTip = new QuickTip(template);

    /* С двумя параметрами. */
    const quickTip = new QuickTip(template, {
        onStart: function () {
            // code ...
        }
    });
    quickTip.run();
    quickTip.set([
        {   
            object: ".first",
            title: "Первый шаг",
            text: "Это первый шаг, он что-то показывает. Текст может быть любым",
            button_next: "Продолжить",
            onStep: function() {
                // code ...
            }
        },
        {   
            object: "#second",
            title: "Второй шаг",
            text: "Это второй шаг, он что-то показывает. Текст может быть любым",
            button_next: "Завершить",
            button_stop: "",
        }
    ]);
```

## Пример Создания template
Сейчас мы создадим template, который будет служить нашей подсказкой.
В данном примере указаны id идентификаторы, которые работают с библиотекой напрямую.
Они помогут вам работать с текстом подсказки, работа с кнопками и тд.

### Список id идентификаторов
Эти id идентификаторы частично должны присутствовать в template:
* `quick-tip-title`              - на титульный блок
* `quick-tip-text`               - на текстовый блок
* `quick-tip-next`               - на кнопку Далее
* `quick-tip-previous`           - на кнопку Предыдущая подсказка
* `quick-tip-stop`               - на кнопку Пропустить
* `quick-tip-indicator`          - счетчик
* `quick-tip-tail`               - хвостик

### Пример, создаем template в HTML:
Вы можете создать свой template.
```html
    <div class="quick-tip-block">

        <!-- Хвостик -->
        <div id="quick-tip-tail" class="quick-tip-tail"></div>

        <!-- Шапка -->
        <div class="quick-tip-head">
            <div id="quick-tip-title" class="quick-tip-title">Меню</div>
            <div class="quick-tip-indicator">
                <i id="quick-tip-previous" class="fa fa-chevron-left" aria-hidden="true"></i>
                <span id="quick-tip-indicator">1 из 3</span>
            </div>
        </div>

        <!-- Текст -->
        <div id="quick-tip-text" class="quick-tip-text">
            Кнопка входа - это произвольный текст
        </div>

        <!-- Кнопки -->
        <div class="quick-tip-footer">
            <a href="#" id="quick-tip-stop">Пропустить</a>
            <button id="quick-tip-next">Далее</button>
        </div>
    </div>
```

# События, которые можно вызвать в конструкторе
* `onStart`                     - Выполняется при инициализации программы
* `onStep`                      - Выполняется во время шага вперед
* `onStepError`                 - Выполняется если элемент не найден
* `onNext`                      - Выполняется перед шагом вперед
* `onPrevious`                  - Выполняется перед шагом назад
* `onEnd`                       - Выполняется в конце программы
* `onSkip`                      - Выполняется при скипе программы
* `onTriggerClick`              - Выполняется при клике на объект

# События, которые можно вызвать на конкретном шаге
* `onStep`                      - Выполняется во время шага вперед
* `onTriggerClick`              - Выполняется при клике на объект

# Объект QuickTip
* `new QuickTip(html)`          - С одним параметром, передается template
* `new QuickTip(html, options)` - С двумя параметрами, передается template и глобальные настройки

#### Методы объекта QuickTip
* `run()`                       - Запускает сценарии с первого шага, если сценарий не задан, ждет сценарий
* `run(int)`                    - Запускает сценарии с шага, если сценарий не задан, ждет сценарий
* `set([{}, {}])`               - Инициализирует сценарий, может быть вызван как до, так и после функции run(), но не после stop()
* `stop()`                      - завершает работу с любого шага
* `getStep()`                   - Получить номер шага (0 - это первый шаг)
* `setStep(int)`                - Устанавливает шаг, второй параметр false по умолчанию
* `setStep(int, true)`          - Устанавливает шаг и запускает его. (необязательно)
* `step()`                      - Запускает текущий шаг, не работает, если функция run() не запущена раньше. Если шаг не найден, то по умолчанию он будет пропущен
* `nextStep()`                  - Вызывает следующий шаг (Если шаг не найден, то по умолчанию он будет пропущен). Если шаг был последним, завершает программу
* `previousStep()`              - Вызывает предыдущей шаг (Если шаг не найден, то по умолчанию он будет пропущен). Если шага был первым (ничего не делает)
* `setPreloader(html)`          - Поможет отработать отсутствие шага. Если template передан, он будет отображаться, пока блок не отобразится. (Игнорирует пропуск шага)

#### JSON Объект 
Для создания сценария, нужно указать правильные поля JSON объекта. 
Снизу представлен JSON объект

```javascript
    const stepItem = {
        /* класс объекта, который показываем */
        object: ".class|#id",

        /* Текст в блоке title (необязательно) по умолчанию пусто */
        templateTitle: "Титульная надпись",

        /* Текст в блоке text (необязательно) по умолчанию пусто */
        templateText: "Привет, это подсказка, не понятно зачем она нужна",

        /* Текст кнопки Пропустить (необязательно) по умолчанию "Пропустить" */
        templateButtonStop: "Пропустить",

        /* Текст кнопки Далее (необязательно) */
        templateButtonNext: "Далее", 

        /* Текст кнопки вернуться (необязательно) по умолчанию "Пропустить" */
        templateButtonPrevious: "Пропустить",

        /* Смещение относительно шага (необязательно) по умолчанию "top: 0, left: 0" */
        offset: { top: 0, left: 0 },

        /* Задержка перед шагом (необязательно) по умолчанию "200" */
        delay: 200,

        /* Отступ от объекта (необязательно) по умолчанию "4" */
        objectMargin: 4,

        /* Активация Хвоста темплейта (необязательно) по умолчанию "true" */
        tailActive: true,

        /* Активация перекрывающих блоков (необязательно) по умолчанию "true" */
        blocksActive: true,

        /* Активация тригера на объекте, он перекрывает клики по объекту (необязательно) по умолчанию "true" */
        triggerActive: true,

        /* Закрепить template на позиции указаной в вашем CSS (необязательно) по умолчанию "false" */
        templateDefaultPosition: false,

        /* Цвет перекрывающих блоков темплейта (необязательно) по умолчанию "9000" */
        blocksColor: "#0f0f0f",

        /* Прозрачность перекрывающих блоков темплейта (необязательно) по умолчанию "9000" */
        blocksOpacity: "0.5",

        /* z-index перекрывающих блоков темплейта (необязательно) по умолчанию "9000" */
        blocksZ: "9000",
    }
```
