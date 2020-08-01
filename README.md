# QuickTip
Библиотека QuickTip “быстрые подсказки” создавалась независимой и поэтому не помешает не одной технологии, используемой в проекте такие как (Vue.js, React.js, Angular.js, Query), так как была написана на чистом JavaScript. 

## Пример Создания Темплейта
Сейчас мы создадим темплейт, который будет служить нашей подсказкой.
В данном примере указаны id идентификаторы, которые работают с библиотекой напрямую.
Они помогут вам работать с текстом подсказки, работа с кнопками и тд.

### Список id идентификаторов
Эти id идентификаторы частично должны присутствовать в темплейте:
* `quickTip_title`              - на блок с титульником
* `quickTip_text`               - на блок с текстом
* `quickTip_next`               - на кнопку Далее
* `quickTip_previous`           - на кнопку Предыдущая подсказка
* `quickTip_stop`               - на кнопку Пропустить
* `quickTip_indicator`          - счетчик
* `quickTip_tail`               - хвостик

### Пример, создаем темлейт в HTML:
Вы можеет создать любой темплейт, но саблюдайте правила CSS и при красиво сверстаном темплейте библиотека поможет вам сделать все красиво на странице.
```html
    <div class="quick_tip_block">
            
        <!-- Хвостик темплейта -->
        <div id="quickTip_tail" class="quick_tip_tail"></div>

        <div class="quick_tip_head">

            <!-- Титульник -->
            <div id="quickTip_title" class="quick_tip_title">Меню</div>

            <div class="quick_tip_indicator">

                <!-- Кнопка шаг назад -->
                <i id="quickTip_previous" class="fa fa-chevron-left" aria-hidden="true"></i>

                <!-- Индикатор шага -->
                <span id="quickTip_indicator">1 из 3</span>
            </div>
        </div>

        <!-- Основной текст -->
        <div id="quickTip_text" class="quick_tip_text">Кнопка фхода, нужна для того чтобы войти</div>

        <div class="quick_tip_footer">

            <!-- Кнопка пропустить -->
            <a href="#" id="quickTip_stop">Пропустить</a>

            <!-- Кнопка Далее -->
            <button id="quickTip_next">Далее</button>
        </div>
    </div>
```

### Пример, создаем темлейт в JavaScript:
```javascript

    let template = `
        <div class="quick_tip_block">

            <div id="quickTip_tail" class="quick_tip_tail"></div>

            <div class="quick_tip_head">
                <div id="quickTip_title" class="quick_tip_title">Меню</div>
                <div class="quick_tip_indicator">
                    <i id="quickTip_previous" class="fa fa-chevron-left" aria-hidden="true"></i>
                    <span id="quickTip_indicator">1 из 3</span>
                </div>
            </div>
            <div id="quickTip_text" class="quick_tip_text">Кнопка фхода, нужна для того чтобы войти</div>
            <div class="quick_tip_footer">
                <a href="#" id="quickTip_stop">Пропустить</a>
                <button id="quickTip_next">Далее</button>
            </div>
        </div>`;
    
```

# События, которые можно вызвать в конструкторе (не обязательно)
* `onStart`                     - Выполняется при инициализации программы
* `onStep`                      - Выполняется во время шага вперед
* `onStepError`                 - Выполняется если елемент не найден
* `onNext`                      - Выполняется перед шагом вперед
* `onPrevious`                  - Выполняется перед шагом назад
* `onEnd`                       - Выполняется в конце программы
* `onSkip`                      - Выполняется при скипе программы
* `onTriggerClick`              - Выполняется при клике на объект

# Функции которые на конкретном шаге (не обязательно)
* `onStep`                      - Выполняется во время шага вперед
* `onTriggerClick`              - Выполняется при клике на объект

# Объект QuickTip
* `new QuickTip(html)`          - С одним параметром, передается темплейт
* `new QuickTip(html, options)` - С двумя параметроми, передается темплейти глобальные настройки

#### Функции объекта QuickTip
* `run()`                       - Запускает сценарии с первого шага, если сценарий не задан, ждет сценарий
* `run(int)`                    - Запускает сценарии с шага, если сценарий не задан, ждет сценарий
* 
* `set([{}, {}])`               - Инициализирует сценарий, может быть вызван как до, так и после функции run(), но не после stop()
* 
* `stop()`                      - завершает работу с любого шага
* 
* `getStep()`                   - Получить номер шага (0 - это первый шаг)
* `setStep(int)`                - Устанавливает шаг, второй параметр false по умолчанию
* `setStep(int, true)`          - Устанавливает шаг и запускает его. (не обязательно)
* 
* `step()`                      - Запускает текущий шаг, не работает, если функция run() не запущена раньше. Если шаг не найден, то по умолчанию он будет пропущен
* 
* `nextStep()`                  - Вызывает следующий шаг (Если шаг не найден, то по умолчанию он будет пропущен). Если шаг был последним, завершает программу
* `previousStep()`              - Вызывает предыдущей шаг (Если шаг не найден, то по умолчанию он будет пропущен). Если шага был первым (ничего не делает)
* 
* `setPreloader(html)`          - Поможет отработать отсутствие шага. Если темплейт передан, он будет отображатсья, пока блок не отобразится. (Игнорирует пропуск шага)

#### JSON Объект 
Для создания сценария, нужно указать правильные поля JSON объекта. 
Снизу представлен JSON объект

```javascript
    {
        /* класс объекта, который показываем */
        object: ".class",

        /* id объекта, который показываем */
        object: "#id",

        /* Текст в блоке title (не обязательно) по умолчанию пусто */
        title: "Титульная надпись",

        /* Текст в блоке text (не обязательно) по умолчанию пусто */
        text: "Привет, это подсказка, не понятно зачем она нужна",

        /* Текст кнопки Пропустить (не обязательно) по умолчанию "Пропустить" */
        button_stop: "Пропустить",

        /* Текст кнопки Далее (не обязательно) */
        button_next: "Далее", 

        /* Текст кнопки вернуться (не обязательно) по умолчанию "Пропустить" */
        button_previous: "Пропустить",

        /* Смещение относительно шага (не обязательно) по умолчанию "top: 0, left: 0" */
        offset: { top: 0, left: 0 },

        /* Задержка перед шагом (не обязательно) по умолчанию "200" */
        delay: 200,

        /* Отступ от объекта (не обязательно) по умолчанию "4" */
        MARGIN_OBJECT: 4,

        /* Активация Хвоста темплейта (не обязательно) по умолчанию "true" */
        tailsActive: true,

        /* Активация перекрывающих блоков (не обязательно) по умолчанию "true" */
        blocksActive: true,

        /* Активация тригера на объекте, он перекрывает клики по объекту (не обязательно) по умолчанию "true" */
        triggerActive: true,

        /* Закрепить темплейт на позиции указаной в вашем CSS (не обязательно) по умолчанию "false" */
        templateDefaultPosition: false,

        /* Цвет перекрывающих блоков темплейта (не обязательно) по умолчанию "9000" */
        blocksColor: "#0f0f0f",

        /* Прозрачность перекрывающих блоков темплейта (не обязательно) по умолчанию "9000" */
        blocksOpacity: "0.5",

        /* z-index перекрывающих блоков темплейта (не обязательно) по умолчанию "9000" */
        blocksZ: "9000",
    }
```

#### Старт QuickTip
Перед началом работы создайте свой темплейт и добавьте его в конструктор.
Установите id идентификаторы на важные поля, чтобы QuickTip мог работать с вашим темплейтом:

```javascript

    // Наш тестовый темплейт, читайте id идентификаторы (Ниже)
    let template = `
        <div class="quick_tip_block">
            
            <!-- Хвостик темплейта -->
            <div id="quickTip_tail" class="quick_tip_tail"></div>

            <div class="quick_tip_head">
                <div id="quickTip_title" class="quick_tip_title">Меню</div>
                <div class="quick_tip_indicator">
                    <i id="quickTip_previous" class="fa fa-chevron-left" aria-hidden="true"></i>
                    <span id="quickTip_indicator">1 из 3</span>
                </div>
            </div>
            <div id="quickTip_text" class="quick_tip_text">Кнопка фхода, нужна для того чтобы войти</div>
            <div class="quick_tip_footer">
                <a href="#" id="quickTip_stop">Пропустить</a>
                <button id="quickTip_next">Далее</button>
            </div>
        </div>`;

    // С одним параметром
    var quickTip = new QuickTip(template);

    // С двумя параметрами. Все парметры указанные в этом блоке, вызываются на каждом шаге
    var quickTip = new QuickTip(template, {

        onStart: function () { /* code ... */ },

        onStep: function() { /* code ... */ },

        onEnd: function () { /* code ... */ },

        /* code ... */

        /* code ... */

        /* code ... */
    });

    // Запускаем (#### Функции объекта QuickTip)
    quickTip.run();

    // Инициализируем сценарий, читайте (#### JSON Объект)
    quickTip.set([
        {   
            object: '.a-bla',
            title: 'Это title шага',
            text: 'Это text шага',
            button_next: 'Продолжить',
            onStep: function() { /* code ... */ }
        },{   
            object: '.f-bla',
            title: 'Это title шага',
            text: 'Это text шага',
            button_next: 'Завершить',
            button_stop: '',
        }
    ]);
```