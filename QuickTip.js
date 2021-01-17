"use strict";

/**
 * global window
 */
(function(window) {
    /**
     * QuickTip - плагин для быстрых подсказок
     * 
     * @param {String} html     template подсказки
     * @param {Object} options  Предварительные настройки
     */
    let QuickTip = function(html, options = null) {

        /**
         * Задержка счетчика в миллисекундах
         *
         * @type {number}
         */
        const DELAY_PRELOADER_ITERATION = 1000;

        /**
         * Задержка отрисовки хвостика
         *
         * @type {Number}
         */
        const DELAY_RENDER_TAIL = 800;

        /**
         * Задержка перемещения подсказки
         * 
         * @type {Number}
         */
        const DELAY_MOVE_TEMPLATE = 200;

        /**
         * Задержка события resize
         *
         * @type {Number}
         */
        const DELAY_EVENT_RESIZE = 600;

        let that = this;

        let quickTipData = [],
            quickTipRun = false;
     
        // Поля template
        let template = null,
            templateRender = false,
            templateCSS = null,
            templateTitle = "Текст",
            templateText = "Какой-то текст",
            templateButtonStop = null,
            templateButtonNext = null,
            templateButtonPrevious = null,
            templateIndicator = "1 из 3";

        // Объект
        let object = null,
            objectOld = null,
            objectClientRect = null,
            objectCoordinate = {},
            objectClick = null;
        
        // Поля хвостика
        let tail = null,
            tailTemp = null,
            tailRender = false,
            tailTopBool = false,
            tailBottomBool = false;
        
        // Поля Блоков
        let blockLeft = null,
            blockTop = null,
            blockRight = null,
            blockBottom = null,
            blockRender = false,
            blockPosition = "absolute";

        let trigger = null,
            triggerOnClick = null;

        let preloader = null,
            preloaderUser = null,
            preloaderRender = false,
            preloaderIteration = 0;

        let stepNextBool = false,
            stepPrevious = false,
            stepIteration = 0;

        /**
         * Цвет блоков
         *
         * @type {String}
         * @public
         */
        QuickTip.prototype.blocksColor = "#0f0f0f";

        /**
         * Прозрачность блока
         *
         * @type {Number}
         * @public
         */
        QuickTip.prototype.blocksOpacity = 0.5;

        /**
         * z-index блоков
         *
         * @type {Number}
         * @public
         */
        QuickTip.prototype.blocksZ = 9900;

        /**
         * Время задержки перехода
         *
         * @type {Number}
         * @public
         */
        QuickTip.prototype.delay = 200;

        /**
         * Время ожидания шага
         *
         * @type {Number}
         * @public
         */
        QuickTip.prototype.errorTimeout = 4;

        /**
         * Отступ от объекта
         *
         * @type {Number}
         * @public
         */
        QuickTip.prototype.objectMargin = 4;

        /**
         * Смещение от заданной позиции
         *
         * @type {Object}
         * @public
         */
        QuickTip.prototype.offset = { left: 0, top: 0 };

        /**
         * Активировать затемняющие блоки
         * 
         * @type {Boolean}
         * @public
         */
        QuickTip.prototype.blocksActive = true;

        /**
         * Активировать хвостик
         * 
         * @type {Boolean}
         * @public
         */
        QuickTip.prototype.tailActive = true;

        /**
         * Активировать триггер объекта
         * 
         * @type {Boolean}
         * @public
         */
        QuickTip.prototype.triggerActive = true;

        /**
         * Активировать кнопку Стоп
         * 
         * @type {Boolean}
         * @public
         */
        QuickTip.prototype.buttonStopActive = true;

        /**
         * Активировать кнопку Вперёд
         * 
         * @type {Boolean}
         * @public
         */
        QuickTip.prototype.buttonNextActive = true;

        /**
         * Активировать кнопку Назад
         * 
         * @type {Boolean}
         * @public
         */
        QuickTip.prototype.buttonPreviousActive = true;

        /**
         * Дефолтная позиция template
         * 
         * @public
         */
        QuickTip.prototype.templateDefaultPosition = false;
        
        /**
         * Следующий шаг
         * 
         * @public
         */
        QuickTip.prototype.nextStep = function() {
            if(stepIteration < quickTipData.length - 1) { 
                stepNextBool = true;
                stepPrevious = false;

                if(objectOld !== null) {
                    objectOld.removeEventListener("click", objectClick, false);
                }

                /**
                 * options.onNext()
                 */
                if(options != null && options.onNext !== undefined) {
                    _userException("Неверно объявлена функция onNext()", typeof options.onNext !== "function");
                    options.onNext();
                }

                stepIteration++;
                preloaderIteration = 0;
                
                this.step(); 
            } else {
                this.stop();
            }
        }
        
        /**
         * Предыдущий шаг
         * 
         * @public
         */
        QuickTip.prototype.previousStep = function() {
            if(objectOld !== null) {
                objectOld.removeEventListener("click", objectClick, false);
            }
            
            if(stepIteration > 0) {
                stepNextBool = false;
                stepPrevious = true;

                /**
                 * options.onPrevious()
                 */
                if(options != null && options.onPrevious !== undefined) {
                    _userException("Неверно объявлена функция onPrevious()", typeof options.onPrevious !== "function");
                    options.onPrevious();
                }

                stepIteration--;
                preloaderIteration = 0;  

                this.step();
            }
        }
        
        /**
         * Установить шаг
         * 
         * @param {Number}  step    Номер шага
         * @param {Boolean} isStart Запустить шаг
         * @public
         */
        QuickTip.prototype.setStep = function(step, isStart = false) {
            stepIteration = step;

            if(isStart) {
                this.step();
            }
        }
        
        /**
         * Получить шаг
         * 
         * @return {Number}
         * @public
         */
        QuickTip.prototype.getStep = function() {
            return stepIteration;
        }
        
        /**
         * Выполнить шаг
         *
         * TODO: Оптимизировать инициализацию настроек
         * @param {Boolean|null} isEventActive
         * @public
         */
        QuickTip.prototype.step = function(isEventActive = true) {
            if(quickTipRun && quickTipData.length > 0 && html != null) {

                // this.blocksColor
                if(options != null && options.blocksColor !== undefined) this.blocksColor = options.blocksColor;
                if(quickTipData[stepIteration].blocksColor !== undefined) this.blocksColor = quickTipData[stepIteration].blocksColor;
                if((options === null || options.blocksColor === undefined) && quickTipData[stepIteration].blocksColor === undefined) this.blocksColor = "#0f0f0f";

                // this.blocksOpacity
                if(options != null && options.blocksOpacity !== undefined) this.blocksOpacity = options.blocksOpacity;
                if(quickTipData[stepIteration].blocksOpacity !== undefined) this.blocksOpacity = quickTipData[stepIteration].blocksOpacity;
                if((options === null || options.blocksOpacity === undefined) && quickTipData[stepIteration].blocksOpacity === undefined) this.blocksOpacity = "0.5";

                // this.blocksZ
                if(options != null && options.blocksZ !== undefined) this.blocksZ = options.blocksZ;
                if(quickTipData[stepIteration].blocksZ !== undefined) this.blocksZ = quickTipData[stepIteration].blocksZ;
                if((options === null || options.blocksZ === undefined) && quickTipData[stepIteration].blocksZ === undefined) this.blocksZ = "9000";

                // this.templateDefaultPosition
                if(options != null && options.templateDefaultPosition !== undefined) this.templateDefaultPosition = options.templateDefaultPosition;
                if(quickTipData[stepIteration].templateDefaultPosition !== undefined) this.templateDefaultPosition = quickTipData[stepIteration].templateDefaultPosition;
                if((options === null || options.templateDefaultPosition === undefined) && quickTipData[stepIteration].templateDefaultPosition === undefined) this.templateDefaultPosition = false;

                // this.delay
                if(options != null && options.delay !== undefined) this.delay = options.delay;
                if(quickTipData[stepIteration].delay !== undefined) this.delay = quickTipData[stepIteration].delay;
                if((options === null || options.delay === undefined) && quickTipData[stepIteration].delay === undefined) this.delay = 200;

                // objectMargin
                if(options != null && options.objectMargin !== undefined) this.objectMargin = options.objectMargin;
                if(quickTipData[stepIteration].objectMargin !== undefined) this.objectMargin = quickTipData[stepIteration].objectMargin;
                if((options === null || options.objectMargin === undefined) && quickTipData[stepIteration].objectMargin === undefined) this.objectMargin = 4;

                // blocksActive
                if(options != null && options.blocksActive !== undefined) this.blocksActive = options.blocksActive;
                if(quickTipData[stepIteration].blocksActive !== undefined) this.blocksActive = quickTipData[stepIteration].blocksActive;
                if((options === null || options.blocksActive === undefined) && quickTipData[stepIteration].blocksActive === undefined) this.blocksActive = true;

                // tailActive
                if(options != null && options.tailActive !== undefined) this.tailActive = options.tailActive;
                if(quickTipData[stepIteration].tailActive !== undefined) this.tailActive = quickTipData[stepIteration].tailActive;
                if((options === null || options.tailActive === undefined) && quickTipData[stepIteration].tailActive === undefined) this.tailActive = true;

                // buttonStopActive 
                if(options != null && options.buttonStopActive !== undefined) this.buttonStopActive = options.buttonStopActive;
                if(quickTipData[stepIteration].buttonStopActive !== undefined) this.buttonStopActive = quickTipData[stepIteration].buttonStopActive;
                if((options === null || options.buttonStopActive === undefined) && quickTipData[stepIteration].buttonStopActive === undefined) this.buttonStopActive = true;

                // buttonNextActive
                if(options != null && options.buttonNextActive !== undefined) this.buttonNextActive = options.buttonNextActive;
                if(quickTipData[stepIteration].buttonNextActive !== undefined) this.buttonNextActive = quickTipData[stepIteration].buttonNextActive;
                if((options === null || options.buttonNextActive === undefined) && quickTipData[stepIteration].buttonNextActive === undefined) this.buttonNextActive = true;

                // buttonPreviousActive 
                if(options != null && options.buttonPreviousActive !== undefined) this.buttonPreviousActive = options.buttonPreviousActive;
                if(quickTipData[stepIteration].buttonPreviousActive !== undefined) this.buttonPreviousActive = quickTipData[stepIteration].buttonPreviousActive;
                if((options === null || options.buttonPreviousActive === undefined) && quickTipData[stepIteration].buttonPreviousActive === undefined) this.buttonPreviousActive = true;

                // triggerActive
                if(options != null && options.triggerActive !== undefined) this.triggerActive = options.triggerActive;
                if(quickTipData[stepIteration].triggerActive !== undefined) this.triggerActive = quickTipData[stepIteration].triggerActive;
                if((options === null || options.triggerActive === undefined) && quickTipData[stepIteration].triggerActive === undefined) this.triggerActive = true;

                // offset
                if(options != null && options.offset !== undefined) this.offset = options.offset;
                if(quickTipData[stepIteration].offset !== undefined) this.offset = quickTipData[stepIteration].offset;
                if((options === null || options.offset === undefined) && quickTipData[stepIteration].offset === undefined) this.offset = { left: 0, top: 0 };

                // errorTimeout
                if(options != null && options.errorTimeout !== undefined) this.errorTimeout = options.errorTimeout;
                if(quickTipData[stepIteration].errorTimeout !== undefined) this.errorTimeout = quickTipData[stepIteration].errorTimeout;
                if((options === null || options.errorTimeout === undefined) && quickTipData[stepIteration].errorTimeout === undefined) this.errorTimeout = 4;

                /**
                 * quickTipData.onStep()
                 */
                if(quickTipData[stepIteration].onStep !== undefined && isEventActive) {
                    _userException("Неверно объявлена функция onStep()", typeof quickTipData[stepIteration].onStep !== "function");
                    quickTipData[stepIteration].onStep();
                }

                /**
                 * options.onStep()
                 */
                else if(options != null && options.onStep !== undefined && isEventActive) {
                    _userException("Неверно объявлена функция onStep()", typeof options.onStep !== "function");
                    options.onStep();
                }
                
                setTimeout(function() {
                    object = _getObject(quickTipData[stepIteration].object);
                    objectCoordinate = _getObjectCoordinate(object);
            
                    if(objectCoordinate === null) {
                        if(preloaderUser === null) {

                            /**
                             * options.onStepError()
                             */
                            if(options != null && options.onStepError !== undefined && isEventActive) {
                                _userException("Неверно объявлена функция onStepError()", typeof options.onStepError !== "function");
                                options.onStepError();
                            }

                            if(stepNextBool) {
                                this.nextStep();
                                _userException(`Шаг с элементом ${quickTipData[stepIteration - 1].object} не найден и будет пропущен.`, true);
                            } 

                            if(stepPrevious) {
                                let check = _isCanGoToPrevious(quickTipData, stepIteration + 1);
                                if(check.bool) {
                                    this.setStep(check.id, true);
                                    _userException(`Шаг с элементом ${quickTipData[stepIteration + 1].object} не найден и будет пропущен.`, true);
                                } else {
                                    this.setStep(stepIteration + 1, true);
                                    _userException(`Шаг с элементом ${quickTipData[stepIteration - 1].object} не найден и будет пропущен.`, true);
                                }
                            }

                            if(!stepNextBool && !stepPrevious) {
                                that.nextStep();
                                _userException(`Шаг с элементом ${quickTipData[stepIteration - 1].object} не найден и будет пропущен.`, true);
                            }
                        } else {
                            _initPreloader();
                            _renderPreloader();

                            setTimeout(function() {
                                if(!quickTipRun) {
                                    return;
                                }
                            
                                preloaderIteration++;
    
                                /** Выполняется, когда время кончится */
                                if(preloaderIteration > that.errorTimeout) {
    
                                    /**
                                     * options.onStepError()
                                     */
                                    if(options != null && options.onStepError !== undefined && isEventActive) {
                                        _userException("Неверно объявлена функция onStepError()", typeof options.onStepError !== "function");
                                        options.onStepError();
                                    }
                                    
                                    if(stepNextBool) {
                                        that.nextStep();
                                        _userException(`Шаг с элементом ${quickTipData[stepIteration - 1].object} не найден и будет пропущен.`, true);
                                    }
    
                                    if(stepPrevious) {
                                        let check = _isCanGoToPrevious(quickTipData, stepIteration + 1);
                                        if(check.bool) {
                                            that.setStep(check.id, true);
                                            _userException(`Шаг с элементом ${quickTipData[stepIteration + 1].object} не найден и будет пропущен.`, true);
                                        } else {
                                            that.setStep(stepIteration + 1, true);
                                            _userException(`Шаг с элементом ${quickTipData[stepIteration - 1].object} не найден и будет пропущен.`, true);
                                        }
                                    }
    
                                    if(!stepNextBool && !stepPrevious) {
                                        that.nextStep();
                                        _userException(`Шаг с элементом ${quickTipData[stepIteration - 1].object} не найден и будет пропущен.`, true);
                                    }
                                }
                                that.step();
                            }, DELAY_PRELOADER_ITERATION);
                        }
                    } else {
                        _destroyPreloader();
                        _destroyTail();

                        /**
                         * quickTipData.onClick()
                         */
                        if(quickTipData[stepIteration].onClick !== undefined && isEventActive) {
                            _userException("Неверно объявлена функция onClick()", typeof quickTipData[stepIteration].onClick !== "function");
                            objectClick = quickTipData[stepIteration].onClick;
                        }

                        /**
                         * options.onClick()
                         */
                        else if(options != null && options.onClick !== undefined && isEventActive) {
                            _userException("Неверно объявлена функция onClick()", typeof options.onClick !== "function");
                            objectClick = options.onClick;
                        }

                        _initTemplate(html);
                        _renderTemplate();

                        _setTemplateTarget(objectCoordinate, _getTemplateCoordinate());
                        _setTemplateData(quickTipData[stepIteration]);

                        if(!that.triggerActive) {
                            _destroyTrigger();
                        }

                        if(that.triggerActive) {

                            /**
                             * quickTipData.triggerOnClick()
                             */
                            if(quickTipData[stepIteration].triggerOnClick !== undefined) {
                                _userException("Неверно объявлена функция triggerOnClick()", typeof quickTipData[stepIteration].triggerOnClick !== "function");
                                triggerOnClick = quickTipData[stepIteration].triggerOnClick;
                            }

                            /**
                             * options.triggerOnClick()
                             */
                            else if(options != null && options.triggerOnClick !== undefined) {
                                _userException("Неверно объявлена функция triggerOnClick()", typeof options.triggerOnClick !== "function");
                                triggerOnClick = options.triggerOnClick;
                            }

                            _initTrigger();
                            _setTriggerTarget(objectCoordinate);
                            _renderTrigger();
                        }

                        templateButtonStop.style.display = that.buttonStopActive ? "block" : "none";
                        templateButtonNext.style.display = that.buttonNextActive ? "block" : "none";
                        templateButtonPrevious.style.display = that.buttonPreviousActive ? "block" : "none";
                
                        if(!that.blocksActive && blockRender) {
                            _destroyBlocks();
                        }
                        
                        if(that.blocksActive) {
                            _initBlocks();
                            _setBlocksTarget(objectCoordinate);
                            _renderBlocks();
                        }
                        
                        if(!that.tailActive && blockRender) {
                            _destroyTail();
                        }

                        if(that.tailActive) {
                            _initTail();
                            setTimeout(function() {
                                _setTailCoordinate(objectCoordinate, _getTemplateCoordinate());
                                _renderTail();
                            }, DELAY_RENDER_TAIL);
                        }
                        
                        stepNextBool = false;
                        stepPrevious = false;
                        object.addEventListener("click", objectClick, false);
                        objectOld = object;
                    }
                }, this.delay);
            }
        }

        /**
         * Запустить
         * 
         * @param {Number|null} step Номер шага
         * @public
         */
        QuickTip.prototype.run = function(step = null) {
            document.body.style.position = "relative";
            document.body.style.overflow = 'hidden';
            document.body.style.userSelect = "none";

            /**
             * onStart()
             */
            if(!preloaderRender && options != null && options.onStart !== undefined) {
                _userException("Неверно объявлена функция onStart()", typeof options.onStart !== "function");
                options.onStart();
            }

            quickTipRun = true;
            
            if(step === null) {
                this.setStep(0);
            } else {
                this.setStep(step);
            }

            this.step();
        }

        /**
         * Задать сценарий
         * 
         * @param {Object[]} data Шаги (маршрутная карта с действиями, задается пользователем)
         * @public
         */
        QuickTip.prototype.set = function(data) {
            quickTipData = data;
            this.step();
        }

        /**
         * Остановить сценарий
         * 
         * @public
         */
        QuickTip.prototype.stop = function() {
            /**
             * options.onEnd()
             */
            if(options != null && options.onEnd !== undefined) {
                _userException("Неверно объявлена функция onEnd()", typeof options.onEnd !== "function");
                options.onEnd();
            }

            end();
        }

        /**
         * Остановить сценарий
         * 
         * @public
         */
        QuickTip.prototype.skip = function() {
            /**
             * options.onSkip()
             */
            if(options != null && options.onSkip !== undefined) {
                _userException("Неверно объявлена функция onSkip()", typeof options.onSkip !== "function");
                options.onSkip();
            }

            end();
        }

        /**
         * Установить блок ожидания
         * 
         * @param {String} html template блока ожидания
         * @public
         */
        QuickTip.prototype.setPreloader = function(html) {
            let temp = document.createElement("div");
                temp.innerHTML = html;
                temp = temp.childNodes[1];

            preloaderUser = temp;
        }

        /**
         * Проверить что находится, если шагать назад
         *
         * @param {Object[]} array  Массив шагов
         * @param {Number}   step   Текущий шаг
         * @return {Object}
         * @private
         */
        function _isCanGoToPrevious(array, step = 0) {
            let result = {
                id: 0,
                bool: false
            };

            step = step - 1;
            if(step < 0) {
                step = 0;
            }

            for(let i = step; i >= 0; i--) {
                if(_getObject(array[i].object) !== null) {
                    result.id = i;
                    result.bool = true;
                    break; 
                }
            }

            return result;
        }
       
        /**
         * Получить ширину документа
         * 
         * @return {Number}
         * @private
         */
        function _getDocumentWidth() {
            return document.body.scrollWidth;
        }

        /**
         * Получить высоту документа
         * 
         * @return {Number}
         * @private
         */
        function _getDocumentHeight() {
            return document.body.scrollHeight;
        }

        /**
         * Получить ширину монитора
         * 
         * @return {Number}
         * @private
         */
        function _getWindowWidth() {
            return document.documentElement.clientWidth;
        }

        /**
         * Получить высоту монитора
         * 
         * @return {Number}
         * @private
         */
        function _getWindowHeight() {
            return document.documentElement.clientHeight;
        }

        /**
         * Получить цель (объект, который мы подсказываем)
         * 
         * @param className Идентификатор объекта
         * @return {Object}
         * @private
         */
        function _getObject(className) {
            if(className !== "" && className !== undefined && className !== null) {
                let equivalent = className.split(':eq('),
                    id = null,
                    selector = null,
                    object = null;

                // Если :eq() - equivalent[1] будет заполнен
                if(equivalent[1] !== undefined) {
                    selector = equivalent[0];
                    equivalent = equivalent[1].split(')');
                    id = Number(equivalent[0]);
                }
                
                // id не равно null
                if(typeof id === "number") {
                    
                    // querySelectorAll не возвращает null
                    object = document.querySelectorAll(selector)[id];

                    if(object === undefined) {
                        object = null;
                    }
                } else {
                    object = document.querySelector(className); 
                }

                return object;
            }
        }

        /**
         * Получить координаты нашей цели
         * 
         * @param {Object} object Наша цель
         * @return {Object}
         * @private
         */
        function _getObjectCoordinate(object) {
            if(object !== null && object !== undefined  && object.style.display !== "none" && object.style.width !== "0px" && object.style.height !== "0px") {
                objectClientRect = object.getBoundingClientRect();
                objectClientRect.OffsetTop = objectClientRect.top + pageYOffset;
                objectClientRect.OffsetBottom = objectClientRect.bottom + pageYOffset;
                objectClientRect.OffsetLeft = objectClientRect.left + pageXOffset;
                objectClientRect.OffsetRight = objectClientRect.right + pageXOffset;
                objectClientRect.centerTop = objectClientRect.top + pageYOffset + objectClientRect.height / 2;
                objectClientRect.centerLeft = objectClientRect.left + pageXOffset + objectClientRect.width / 2;

                return objectClientRect;
            }

            return null;
        }
        
        /**
         * Инициализировать template
         * 
         * @param {String} html template
         * @private
         */
        function _initTemplate(html) {
            if(template === null) {
                let temp = document.createElement("div");
                temp.innerHTML = html;
                temp = temp.childNodes[1];

                templateTitle = temp.querySelector("#quick-tip-title");
                templateText = temp.querySelector("#quick-tip-text");

                templateButtonStop = temp.querySelector("#quick-tip-stop");
                if(templateButtonStop != null) templateButtonStop.onclick = function() { that.skip(); }

                templateButtonNext = temp.querySelector("#quick-tip-next");
                if(templateButtonNext != null) templateButtonNext.onclick = function() { that.nextStep(); }

                templateButtonPrevious = temp.querySelector("#quick-tip-previous");
                if(templateButtonPrevious != null) templateButtonPrevious.onclick = function() { that.previousStep(); }

                templateIndicator = temp.querySelector("#quick-tip-indicator");
                template = temp;
                templateCSS = temp.style;
            }
        }

        /**
         * Записать информацию в template
         * 
         * @param {String} data template
         * @private
         */
        function _setTemplateData(data) {
            // Title
            if(data.templateTitle === undefined && templateTitle != null) templateTitle.innerHTML = "";
            else if(templateTitle != null) templateTitle.innerHTML = data.templateTitle;
        
            // Основной текст
            if(data.templateText === undefined && templateText != null) templateText.innerHTML = "";
            else if(templateText != null) templateText.innerHTML = data.templateText;

            // Кнопка стоп
            if(data.templateButtonStop === undefined && templateButtonStop != null) templateButtonStop.innerHTML = "Пропустить";
            else if(templateButtonStop != null) templateButtonStop.innerHTML = data.templateButtonStop;

            // Кнопка далее
            if(data.templateButtonNext === undefined && templateButtonNext != null) templateButtonNext.innerHTML = "Далее";
            else if(templateButtonNext != null) templateButtonNext.innerHTML = data.templateButtonNext;

            // Индикатор
            if(data.templateIndicator === undefined && templateIndicator != null) templateIndicator.innerHTML = that.getStep() + 1 + " из " + quickTipData.length;
            else if(templateIndicator != null) templateIndicator.innerHTML = data.templateIndicator;
        }

        /**
         * Получить координаты template
         * 
         * @return {Object}
         * @private
         */
        function _getTemplateCoordinate() {
            if(template !== null) {
                let coordinate = objectClientRect = template.getBoundingClientRect();
                coordinate.OffsetTop = coordinate.top + pageYOffset;
                coordinate.OffsetBottom = coordinate.bottom + pageYOffset;
                coordinate.OffsetLeft = coordinate.left + pageXOffset;
                coordinate.OffsetRight = coordinate.right + pageXOffset;
                coordinate.centerTop = coordinate.top + pageYOffset + coordinate.height / 2;
                coordinate.centerLeft = coordinate.left + pageXOffset + coordinate.width / 2;
            
                return coordinate;
            }

            return null;
        }

        /**
         * Указать цель для template
         * 
         * @param {Object} objectCoordinate     Координаты нашей цели
         * @param {Object} coordinateTemplate   Координаты нашей подсказки
         * @private
         */
        function _setTemplateTarget(objectCoordinate, coordinateTemplate) {
            setTimeout(function() {
                if(!that.templateDefaultPosition) {
                    template.style.transform = "translate(0px, 0px)";

                    // Разрешенная зона
                    let allowRange = coordinateTemplate.width + that.objectMargin;

                    // Отступы объекта
                    let marginLeft = objectCoordinate.OffsetLeft,
                        marginRight = _getDocumentWidth() - objectCoordinate.OffsetRight;

                    // Если маленький экран
                    if(_getDocumentWidth() < 374) {
                        allowRange = allowRange / 2;  
                    }

                    // Середина на маленьких экранах (Должно перебить условие "Самый левый блок")
                    if(objectCoordinate.centerLeft === _getDocumentWidth() / 2) {
                        template.style.left = objectCoordinate.centerLeft - coordinateTemplate.width / 2 + that.offset.left + "px";
                    }

                    // Самый левый блок
                    else if(objectCoordinate.centerLeft < allowRange) {

                        // Если вплотную к экрану
                        if(objectCoordinate.OffsetLeft < 10) {
                            template.style.left = objectCoordinate.OffsetLeft + 10 + that.offset.left + "px";
                        } else {
                            template.style.left = objectCoordinate.OffsetLeft - marginLeft / 2 + that.offset.left + "px";
                        }
                    }

                    // Самый правый блок
                    else if(objectCoordinate.centerLeft > _getDocumentWidth() - allowRange) {

                        // Если вплотную к экрану
                        if(objectCoordinate.OffsetLeft > _getDocumentWidth() - 10) {
                            template.style.left = objectCoordinate.OffsetRight - coordinateTemplate.width - 10 + that.offset.left + "px";
                        } else {
                            template.style.left = objectCoordinate.OffsetRight - coordinateTemplate.width + marginRight / 2 + that.offset.left + "px";
                        }
                    }

                    // Середина
                    else {
                        template.style.left = objectCoordinate.centerLeft - coordinateTemplate.width / 2 + that.offset.left + "px";
                    }
                    
                    // Если блок снизу
                    if(objectCoordinate.OffsetTop > _getDocumentHeight() - coordinateTemplate.height - that.objectMargin * 2) {
                        tailTopBool = false;
                        tailBottomBool = true;
                        template.style.top = objectCoordinate.OffsetTop - coordinateTemplate.height - that.objectMargin * 2 + that.offset.top + "px";
                    } else {

                        tailTopBool = true;
                        tailBottomBool = false;
                        template.style.top = objectCoordinate.OffsetTop + objectCoordinate.height + that.objectMargin * 2 + that.offset.top + "px";
                    }

                    // Если template не влезает из-за большой цели
                    if(_getWindowHeight() / 1.3 - coordinateTemplate.height < objectCoordinate.height) {
                        template.style.top = objectCoordinate.centerTop + that.offset.top +  "px";
                    }

                    object.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
                } else {
                    template.style = templateCSS;
                }
            }, DELAY_MOVE_TEMPLATE);
        }

        /**
         * Нарисовать template
         * 
         * @private
         */
        function _renderTemplate() {
            if(templateRender === false) {
                document.body.append(template);
                templateRender = true;
            }
        }

        /**
         * Уничтожить template
         * 
         * @private
         */
        function _destroyTemplate() {
            if(template !== null) {
                template.remove();
                template = null;
            }
            
            templateRender = false;
        }

        /**
         * Инициализировать закрывающие всё блоки
         * 
         * @private
         */
        function _initBlocks() {
            if(blockLeft === null && blockTop === null && blockRight === null && blockBottom === null) {
                blockPosition = (_getDocumentHeight() < window.innerHeight) ? "fixed" : "absolute";

                blockLeft = document.createElement("div");
                blockTop = document.createElement("div");
                blockRight = document.createElement("div");
                blockBottom = document.createElement("div");

                blockLeft.style.backgroundColor = that.blocksColor;
                blockLeft.style.opacity = that.blocksOpacity;
                blockLeft.style.zIndex = that.blocksZ;
                blockLeft.style.position = blockPosition;
                blockLeft.style.left = "0px";
                blockLeft.style.top = "0px";
                blockLeft.style.right = "0px";
                blockLeft.style.bottom = "0px";

                blockTop.style.backgroundColor = that.blocksColor;
                blockTop.style.opacity = that.blocksOpacity;
                blockTop.style.zIndex = that.blocksZ;
                blockTop.style.position = blockPosition;
                blockTop.style.left = "0px";
                blockTop.style.top = "0px";
                blockTop.style.right = "0px";
                blockTop.style.bottom = "0px";

                blockRight.style.backgroundColor = that.blocksColor;
                blockRight.style.opacity = that.blocksOpacity;
                blockRight.style.zIndex = that.blocksZ;
                blockRight.style.position = blockPosition;
                blockRight.style.left = "0px";
                blockRight.style.top = "0px";
                blockRight.style.right = "0px";
                blockRight.style.bottom = "0px";

                blockBottom.style.backgroundColor = that.blocksColor;
                blockBottom.style.opacity = that.blocksOpacity;
                blockBottom.style.zIndex = that.blocksZ;
                blockBottom.style.position = blockPosition;
                blockBottom.style.left = "0px";
                blockBottom.style.top = "0px";
                blockBottom.style.right = "0px";
                blockBottom.style.bottom = "0px";
            } else {

                blockLeft.style.backgroundColor = that.blocksColor;
                blockLeft.style.opacity = that.blocksOpacity;
                blockLeft.style.zIndex = that.blocksZ;

                blockTop.style.backgroundColor = that.blocksColor;
                blockTop.style.opacity = that.blocksOpacity;
                blockTop.style.zIndex = that.blocksZ;

                blockRight.style.backgroundColor = that.blocksColor;
                blockRight.style.opacity = that.blocksOpacity;
                blockRight.style.zIndex = that.blocksZ;

                blockBottom.style.backgroundColor = that.blocksColor;
                blockBottom.style.opacity = that.blocksOpacity;
                blockBottom.style.zIndex = that.blocksZ;
            }
        }
        
        /**
         * Задать блокам цель
         * 
         * @param {Object} objectCoordinate Координаты нашей цели
         * @private
         */
        function _setBlocksTarget(objectCoordinate) {
            // TOP
            let topPosition = objectCoordinate.OffsetTop - that.objectMargin;
            blockTop.style.height = ((topPosition > 0) ? topPosition : 0) + "px";
            blockTop.style.bottom = "unset";
            
            // BOTTOM
            let bottomPosition = (blockPosition === "absolute") ? _getDocumentHeight() - (objectCoordinate.OffsetTop + objectCoordinate.height + that.objectMargin) : window.innerHeight - (objectCoordinate.OffsetTop + objectCoordinate.height + that.objectMargin);
            blockBottom.style.height = ((bottomPosition > 0) ? bottomPosition : 0)  + "px";
            blockBottom.style.top = "unset";
        
            // LEFT
            let leftPosition = objectCoordinate.OffsetLeft - that.objectMargin;
            blockLeft.style.width = ((leftPosition> 0) ? leftPosition : 0) + "px";
            blockLeft.style.top = topPosition + "px";
            blockLeft.style.bottom = bottomPosition + "px";
            blockLeft.style.right = "unset";
        
            // RIGHT
            let rightPosition = _getDocumentWidth() - (objectCoordinate.OffsetLeft + that.objectMargin + objectCoordinate.width);
            blockRight.style.width = ((rightPosition > 0) ? rightPosition : 0) + "px";
            blockRight.style.top = topPosition + "px";
            blockRight.style.bottom = bottomPosition + "px";
            blockRight.style.left = "unset";
        }

        /**
         * Нарисовать блоки
         * 
         * @private
         */
        function _renderBlocks() {
            if(blockRender === false) {
                document.body.append(blockLeft);
                document.body.append(blockTop);
                document.body.append(blockRight);
                document.body.append(blockBottom);
                
                blockRender = true;
            }
        }
        
        /**
         * Уничтожить блоки
         * 
         * @private
         */
        function _destroyBlocks() {
            if(blockLeft !== null) {
                blockLeft.remove();
                blockLeft = null; 
            }

            if(blockTop !== null) {
                blockTop.remove();
                blockTop = null;
            }

            if(blockRight !== null) {
                blockRight.remove();
                blockRight = null;
            }

            if(blockBottom !== null) {
                blockBottom.remove();
                blockBottom = null;
            }

            blockRender = false;
        }

        /**
         * Инициализировать триггер
         * 
         * @private
         */
        function _initTrigger() {
            if(trigger === null) {
                trigger = document.createElement("div");
                trigger.style.position = "absolute";
                trigger.style.left = "0px";
                trigger.style.top = "0px";
                trigger.style.right = "0px";
                trigger.style.bottom = "0px";
                trigger.style.zIndex = "9970";
            } else {
                let triggerTemp = trigger.cloneNode(true);

                _destroyTrigger();

                trigger = triggerTemp;
                trigger.style.zIndex = "9970";
            }
        }
        
        /**
         * Задать цель триггеру
         * 
         * @param {Object} objectCoordinate Координаты нашей цели
         * @private
         */
        function _setTriggerTarget(objectCoordinate) {
            trigger.style.width = objectCoordinate.width + "px";
            trigger.style.height = objectCoordinate.height + "px";
            trigger.style.top = objectCoordinate.OffsetTop + "px";
            trigger.style.left = objectCoordinate.OffsetLeft + "px";
            trigger.style.right = "unset";
            trigger.style.bottom = "unset";
            trigger.style.cursor = "pointer";
            trigger.addEventListener("click", triggerOnClick, false);
        }

        /**
         * Нарисовать триггер
         * 
         * @private
         */
        function _renderTrigger() {
            if(that.triggerActive) {
                document.body.append(trigger);
            } else {
                _destroyTrigger();
            }
        }

        /**
         * Уничтожить триггер
         * 
         * @private
         */
        function _destroyTrigger() {
            if(trigger != null) { 
                trigger.remove(); 
                trigger = null; 
            }
        }

        /**
         * Инициализировать хвостик
         * 
         * @private
         */
        function _initTail() {
            if(tail === null) {
                if(tailTemp === null) {
                    tailTemp = document.querySelector("#quick-tip-tail");
                }

                if(tailTemp !== null) {
                    tail = tailTemp;
                    tail.style.position = "absolute";
                    tail.remove();
                } else {
                    that.tailActive = false;
                }
            }
        }

        /**
         * Задать цель хвостику
         * 
         * @param {Object} objectCoordinate     Координаты нашей цели
         * @param {Object} coordinateTemplate   Координаты нашей подсказки
         * @private
         */
        function _setTailCoordinate(objectCoordinate, coordinateTemplate) {
            if(that.tailActive) {
                tail.style.left = objectCoordinate.centerLeft - 10 + "px";
                if(tailTopBool) {
                    tail.style.transform = "rotate(0deg)";
                    tail.style.top = coordinateTemplate.OffsetTop - 20 + "px";
                }
            
                if(tailBottomBool) {
                    tail.style.transform = "rotate(180deg)";
                    tail.style.top = coordinateTemplate.OffsetTop + coordinateTemplate.height + "px";
                }
            }
        }
        
        /**
         * Нарисовать хвостик
         * 
         * @private
         */
        function _renderTail() {
            if(that.tailActive && tailRender === false) {
                document.body.append(tail);
                tailRender = true;
            }
        }
        
        /**
         * Уничтожить хвостик
         * 
         * @private
         */
        function _destroyTail() {
            if(tail !== null) {
                tail.remove();
                tail = null;
            }

            tailRender = false;
        }

        /**
         * Инициализировать preloader
         * 
         * @private
         */
        function _initPreloader() {
            if(preloader === null) {
                preloader = preloaderUser;
            }
        }

        /**
         * Нарисовать preloader
         * 
         * @private
         */
        function _renderPreloader() {
            if(preloaderRender === false) {
                document.body.append(preloader);
                preloaderRender = true;
            }
        }

        /**
         * Уничтожить preloader
         * 
         * @private
         */
        function _destroyPreloader() {
            if(preloader != null) {
                preloader.remove(); 
                preloader = null; 
            }

            preloaderRender = false;
        }

        /**
         * Завершить выполнение плагина
         * 
         * @private
         */
        function end() {
            _destroyTemplate();
            _destroyTail();
            _destroyBlocks();
            _destroyPreloader();
            _destroyTrigger();

            document.body.style.overflow = 'auto';
            document.body.style.userSelect = "auto";

            quickTipRun = false;

            stepNextBool = false;
            stepPrevious = false;

            if(objectOld !== null) {
                objectOld.removeEventListener("click", objectClick, false);
            }
        }

        /**
         * Пользовательское исключение
         *
         * @param message Сообщение при исключении
         * @param condition Условие, при котором должно сработать исключение
         * @private
         */
        function _userException(message, condition) {
            if(condition) {
                throw message;
            }
        }

        let onresizeBool = false,
            timerId = null;

        /**
         * Событие onresize
         *
         * @private
         */
        function _eventResize() {
            onresizeBool = true;
            clearTimeout(timerId);

            if(quickTipRun && quickTipData.length > 0 && onresizeBool) {
                _destroyTemplate();
                _destroyTail();
                _destroyBlocks();

                timerId = setTimeout(function() {
                    that.step(false);
                    onresizeBool = false;
                }, DELAY_EVENT_RESIZE);
            }
        }

        /**
         * Событие onkeydown
         *
         * @private
         */
        function _eventKeyDown(event) {
            event = event || window.event;

            if(quickTipRun) {
                switch(event.keyCode) {

                    /** Press enter */
                    case 13:
                        that.nextStep();
                        break;
                    
                    /** Press escape */
                    case 27:
                        end();
                        break;
                    
                    /** Press end */
                    case 35:
                        end();
                        break;

                    /** Press space */
                    case 32:
                        that.nextStep();
                        break;

                    /** Press page up */
                    case 33:
                        that.previousStep();
                        break;

                    /** Press page down */
                    case 34:
                        that.nextStep();
                        break;

                    /** Press arrow left */
                    case 37:
                        that.previousStep();
                        break;

                    /** Press arrow up */
                    case 38:
                        that.previousStep();
                        break;

                    /** Press arrow right */
                    case 39:
                        that.nextStep();
                        break;

                    /** Press arrow down */
                    case 40:
                        that.nextStep();
                        break;

                    /** Press numpad 2 */
                    case 98:
                        that.nextStep();
                        break;

                    /** Press numpad 4 */
                    case 100:
                        that.previousStep();
                        break;

                    /** Press numpad 6 */
                    case 102:
                        that.nextStep();
                        break;

                    /** Press numpad 8 */
                    case 104:
                        that.previousStep();
                        break;
                }
            }
        }

        window.addEventListener("resize", _eventResize, true);

        window.addEventListener("keydown", _eventKeyDown, true);
    };

    window.QuickTip = QuickTip;
})(window);