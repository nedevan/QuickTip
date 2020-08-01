(function(window) {

    var QuickTip = function(html, options = null) {

        let that = this;
        
        let step_i = 0;

        let dataArray = [];

        let run = false;
     
        let title = "Текст",
            text = "Какой-то текст",
            button_stop = null,
            button_next = null,
            button_previous = null,
            indicator = "1 из 3";

        // Поля темплейта
        let template = null,
            templateRender = false,
            templateCSS = null;

        // Объект
        let object = null,
            objectOld = null,
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
            blocksRender = false,
            _position = "absolute";

        let trigger = null,
            onTriggerClick = null;

        let preloader = null
            preloaderUser = null,
            preloaderRender = false,
            preloader_i = 0;

        let stepNextBool = false,
            stepPrevious = false;

        // Цвет блоков
        QuickTip.prototype.blocksColor = "#0f0f0f";

        // Прозрачность блока
        QuickTip.prototype.blocksOpacity = "0.5";

        // z-index блоков
        QuickTip.prototype.blocksZ = "9900";

        // Время задержки перехода
        QuickTip.prototype.delay = 200;

        // Время ожидания шага
        QuickTip.prototype.errorTimeout = 4;
        
        // Отступ от объекта
        QuickTip.prototype.MARGIN_OBJECT = 4;

        // Смещение от заданной позиции
        QuickTip.prototype.offset = { left: 0, top: 0 };

        // Активировать затемняющие блоки
        QuickTip.prototype.blocksActive = true;

        // Активировать хвостик
        QuickTip.prototype.tailActive = true;

        // Активировать тригер объекта
        QuickTip.prototype.triggerActive = true;

        // Активировать кнопку Стоп
        QuickTip.prototype.buttonStopActive = true;

        // Активировать кнопку Вперд
        QuickTip.prototype.buttonNextActive = true;

        // Активировать кнопку Назад
        QuickTip.prototype.buttonPreviousActive = true;

        // Дефолтная позиция темплейта
        QuickTip.prototype.templateDefaultPosition = false;
        
        // Следующий шаг
        QuickTip.prototype.nextStep = function() {

            if(step_i < dataArray.length - 1) { 

                stepNextBool = true;
                stepPrevious = false;

                if(objectOld !== null) objectOld.removeEventListener("click", objectClick, false);

                // options.onNext()
                if(options != null && options.onNext !== undefined) {

                    if(typeof options.onNext === "function") options.onNext();

                    else throw "Неверно объявлена функция onNext()";
                }

                step_i++;
                preloader_i = 0;
                
                this.step(); 
            }

            else this.stop();
        }
        
        // Предыдущий шаг
        QuickTip.prototype.previousStep = function() {

            if(objectOld !== null) objectOld.removeEventListener("click", objectClick, false);
            
            if(step_i > 0) {

                stepNextBool = false;
                stepPrevious = true;

                // options.onPrevious()
                if(options != null && options.onPrevious !== undefined) {

                    if(typeof options.onPrevious === "function") options.onPrevious();

                    else throw "Неверно объявлена функция onPrevious()";
                }

                step_i--;
                preloader_i = 0;  

                this.step();
            }
        }
        
        // Установить шаг
        QuickTip.prototype.setStep = function(_step, _bool = false) {
        
            step_i = _step;

            if(_bool) this.step();
        }
        
        // Получить шаг
        QuickTip.prototype.getStep = function() {
        
            return step_i;
        }
        
        // Выполнить шаг
        QuickTip.prototype.step = function(eventActive = true) {
        
            if(run && dataArray.length > 0 && html != null) {

                // Это глобальные и локальные настройки (ПЕРЕДЕЛАТЬ)
                // this.blocksColor
                if(options != null && options.blocksColor != undefined) this.blocksColor = options.blocksColor;
                if(dataArray[step_i].blocksColor != undefined) this.blocksColor = dataArray[step_i].blocksColor;
                if((options === null || options.blocksColor === undefined) && dataArray[step_i].blocksColor === undefined) this.blocksColor = "#0f0f0f";

                // this.blocksOpacity
                if(options != null && options.blocksOpacity != undefined) this.blocksOpacity = options.blocksOpacity;
                if(dataArray[step_i].blocksOpacity != undefined) this.blocksOpacity = dataArray[step_i].blocksOpacity;
                if((options === null || options.blocksOpacity === undefined) && dataArray[step_i].blocksOpacity === undefined) this.blocksOpacity = "0.5";

                // this.blocksZ
                if(options != null && options.blocksZ != undefined) this.blocksZ = options.blocksZ;
                if(dataArray[step_i].blocksZ != undefined) this.blocksZ = dataArray[step_i].blocksZ;
                if((options === null || options.blocksZ === undefined) && dataArray[step_i].blocksZ === undefined) this.blocksZ = "9000";

                // this.templateDefaultPosition
                if(options != null && options.templateDefaultPosition != undefined) this.templateDefaultPosition = options.templateDefaultPosition;
                if(dataArray[step_i].templateDefaultPosition != undefined) this.templateDefaultPosition = dataArray[step_i].templateDefaultPosition;
                if((options === null || options.templateDefaultPosition === undefined) && dataArray[step_i].templateDefaultPosition === undefined) this.templateDefaultPosition = false;

                // this.delay
                if(options != null && options.delay != undefined) this.delay = options.delay;
                if(dataArray[step_i].delay != undefined) this.delay = dataArray[step_i].delay;
                if((options === null || options.delay === undefined) && dataArray[step_i].delay === undefined) this.delay = 200;

                // MARGIN_OBJECT
                if(options != null && options.MARGIN_OBJECT != undefined) this.MARGIN_OBJECT = options.MARGIN_OBJECT;
                if(dataArray[step_i].MARGIN_OBJECT != undefined) this.MARGIN_OBJECT = dataArray[step_i].MARGIN_OBJECT;
                if((options === null || options.MARGIN_OBJECT === undefined) && dataArray[step_i].MARGIN_OBJECT === undefined) this.MARGIN_OBJECT = 4;

                // blocksActive
                if(options != null && options.blocksActive != undefined) this.blocksActive = options.blocksActive;
                if(dataArray[step_i].blocksActive != undefined) this.blocksActive = dataArray[step_i].blocksActive;
                if((options === null || options.blocksActive === undefined) && dataArray[step_i].blocksActive === undefined) this.blocksActive = true;

                // tailActive
                if(options != null && options.tailActive != undefined) this.tailActive = options.tailActive;
                if(dataArray[step_i].tailActive != undefined) this.tailActive = dataArray[step_i].tailActive;
                if((options === null || options.tailActive === undefined) && dataArray[step_i].tailActive === undefined) this.tailActive = true;

                // buttonStopActive 
                if(options != null && options.buttonStopActive != undefined) this.buttonStopActive = options.buttonStopActive;
                if(dataArray[step_i].buttonStopActive != undefined) this.buttonStopActive = dataArray[step_i].buttonStopActive;
                if((options === null || options.buttonStopActive === undefined) && dataArray[step_i].buttonStopActive === undefined) this.buttonStopActive = true;

                // buttonNextActive
                if(options != null && options.buttonNextActive != undefined) this.buttonNextActive = options.buttonNextActive;
                if(dataArray[step_i].buttonNextActive != undefined) this.buttonNextActive = dataArray[step_i].buttonNextActive;
                if((options === null || options.buttonNextActive === undefined) && dataArray[step_i].buttonNextActive === undefined) this.buttonNextActive = true;

                // buttonPreviousActive 
                if(options != null && options.buttonPreviousActive != undefined) this.buttonPreviousActive = options.buttonPreviousActive;
                if(dataArray[step_i].buttonPreviousActive != undefined) this.buttonPreviousActive = dataArray[step_i].buttonPreviousActive;
                if((options === null || options.buttonPreviousActive === undefined) && dataArray[step_i].buttonPreviousActive === undefined) this.buttonPreviousActive = true;

                // triggerActive
                if(options != null && options.triggerActive != undefined) this.triggerActive = options.triggerActive;
                if(dataArray[step_i].triggerActive != undefined) this.triggerActive = dataArray[step_i].triggerActive;
                if((options === null || options.triggerActive === undefined) && dataArray[step_i].triggerActive === undefined) this.triggerActive = true;

                // offset
                if(options != null && options.offset != undefined) this.offset = options.offset;
                if(dataArray[step_i].offset != undefined) this.offset = dataArray[step_i].offset;
                if((options === null || options.offset === undefined) && dataArray[step_i].offset === undefined) this.offset = { left: 0, top: 0 };

                // errorTimeout
                if(options != null && options.errorTimeout != undefined) this.errorTimeout = options.errorTimeout;
                if(dataArray[step_i].errorTimeout != undefined) this.errorTimeout = dataArray[step_i].errorTimeout;
                if((options === null || options.errorTimeout === undefined) && dataArray[step_i].errorTimeout === undefined) this.errorTimeout = 4;

                // dataArray.onStep()
                if(dataArray[step_i].onStep !== undefined && eventActive) {

                    if(typeof dataArray[step_i].onStep === "function") dataArray[step_i].onStep();
    
                    else throw "Неверно объявлена функция onStep()";
                }

                // options.onStep()
                else if(options != null && options.onStep !== undefined && eventActive) {

                    if(typeof options.onStep === "function") options.onStep();

                    else throw "Неверно объявлена функция onStep()";
                }
                
                setTimeout(() => {
                    
                    object = getObject(dataArray[step_i].object);

                    objectCoordinate = getObjectCoordinate(object);
            
                    if(objectCoordinate === null) {

                        if(preloaderUser === null) {

                            // options.onStepError()
                            if(options != null && options.onStepError !== undefined && eventActive) {

                                if(typeof options.onStepError === "function") options.onStepError();
                
                                else throw "Неверно объявлена функция onStepError()";
                            }

                            if(stepNextBool) { this.nextStep(); throw 'Шаг с элементом "' + dataArray[step_i - 1].object + '" не найден и будет пропущен.'; } 

                            if(stepPrevious) { 

                                let check = checkToDoPrevious(dataArray, step_i + 1);
                                
                                if(check.bool) {

                                    this.setStep(check.id, true); 
                                    throw 'Шаг с элементом "' + dataArray[step_i + 1].object + '" не найден и будет пропущен.'; 
                                }

                                else { 

                                    this.setStep(step_i + 1, true); 
                                    throw 'Шаг с элементом "' + dataArray[step_i - 1].object + '" не найден и будет пропущен.'; 
                                }
                            }

                            if(!stepNextBool && !stepPrevious) { that.nextStep(); throw 'Шаг с элементом "' + dataArray[step_i - 1].object + '" не найден и будет пропущен.'; }
                        }

                        else {

                            initPreloader();
                            renderPreloader();

                            setTimeout(function() {

                                if(!run) return;
                            
                                preloader_i++;
    
                                // Выполняется, когда время кончится
                                if(preloader_i > that.errorTimeout) {
    
                                    // options.onStepError()
                                    if(options != null && options.onStepError !== undefined && eventActive) {
    
                                        if(typeof options.onStepError === "function") options.onStepError();
                        
                                        else throw "Неверно объявлена функция onStepError()";
                                    }
    
                                    if(!run) return;
                                    
                                    if(stepNextBool) { that.nextStep(); throw 'Шаг с элементом "' + dataArray[step_i - 1].object + '" не найден и будет пропущен.'; } 
    
                                    if(stepPrevious) {

                                        let check = checkToDoPrevious(dataArray, step_i + 1);
                                
                                        if(check.bool) {

                                            that.setStep(check.id, true); 
                                            throw 'Шаг с элементом "' + dataArray[step_i + 1].object + '" не найден и будет пропущен.'; 
                                        }

                                        else { 
                                            
                                            that.setStep(step_i + 1, true); 
                                            throw 'Шаг с элементом "' + dataArray[step_i - 1].object + '" не найден и будет пропущен.'; 
                                        }
                                    }
    
                                    if(!stepNextBool && !stepPrevious) { that.nextStep(); throw 'Шаг с элементом "' + dataArray[step_i - 1].object + '" не найден и будет пропущен.'; }
                                }
    
                                that.step();
                            }, 1000);
                        }
                    }

                    else {
                        
                        destroyPreloader();
                        destroyTail();

                        // dataArray.onClick()
                        if(dataArray[step_i].onClick !== undefined && eventActive) {
   
                            if(typeof dataArray[step_i].onClick === "function") objectClick = dataArray[step_i].onClick;

                            else throw "Неверно объявлена функция onClick()";
                        }

                        // options.onClick()
                        else if(options != null && options.onClick !== undefined && eventActive) {

                            if(typeof options.onClick === "function") objectClick = options.onClick;
                            
                            else throw "Неверно объявлена функция onClick()"; 
                        }

                        initTemplate(html);
                        renderTemplate();

                        setTemplateTarget(objectCoordinate, getTemplateCoordinate());
                        setTemplateData(dataArray[step_i]);

                        if(!this.triggerActive) destroyTrigger();

                        if(this.triggerActive) {

                            // dataArray.onTriggerClick()
                            if(dataArray[step_i].onTriggerClick !== undefined) {

                                if(typeof dataArray[step_i].onTriggerClick === "function") onTriggerClick = dataArray[step_i].onTriggerClick;
                
                                else throw "Неверно объявлена функция onTriggerClick()";
                            }

                            // options.onTriggerClick()
                            else if(options != null && options.onTriggerClick !== undefined) {

                                if(typeof options.onTriggerClick === "function") onTriggerClick = options.onTriggerClick;
                
                                else throw "Неверно объявлена функция onTriggerClick()";
                            }

                            initTrigger();
                            setTriggerTarget(objectCoordinate);
                            renderTrigger();
                        }

                        button_stop.style.display = this.buttonStopActive ? "block" : "none";
            
                        button_next.style.display = this.buttonNextActive ? "block" : "none";
            
                        button_previous.style.display = this.buttonPreviousActive ? "block" : "none";
                
                        if(!this.blocksActive && blocksRender) destroyBlocks();
                        
                        if(this.blocksActive) {
                            
                            initBlocks();
                            setBlocksTarget(objectCoordinate);
                            renderBlocks();
                        }
                        
                        if(!this.tailActive && blocksRender) destroyTail();

                        if(this.tailActive) {
                            
                            initTail();

                            setTimeout(function() {

                                setTailCoordinate(objectCoordinate, getTemplateCoordinate());
                                renderTail();
                            }, 800);
                        }
                        
                        stepNextBool = false;
                        stepPrevious = false;

                        object.addEventListener("click", objectClick, false);

                        objectOld = object;
                    }
                }, this.delay);
            }
        }

        // Запустить
        QuickTip.prototype.run = function(__step = null) {

            document.body.style.position = "relative";
            document.body.style.overflow = 'hidden';
            document.body.style.userSelect = "none";

            // onStart()
            if(!preloaderRender && options != null && options.onStart !== undefined) {

                if(typeof options.onStart === "function") options.onStart();

                else throw "Неверно объявлена функция onStart()";
            }

            run = true;
            
            if(__step === null) this.setStep(0);

            else this.setStep(__step);

            this.step();
        }

        // Задать сценарий
        QuickTip.prototype.set = function(_dataArray) {

            dataArray = _dataArray;

            this.step();
        }

        // Остановить сценарий
        QuickTip.prototype.stop = function() {

            // options.onEnd()
            if(options != null && options.onEnd !== undefined) {

                if(typeof options.onEnd === "function") options.onEnd();

                else throw "Неверно объявлена функция onEnd()";
            }

            end();
        }

        // Остановить сценарий
        QuickTip.prototype.skip = function() {

            // options.onSkip()
            if(options != null && options.onSkip !== undefined) {

                if(typeof options.onSkip === "function") options.onSkip();

                else throw "Неверно объявлена функция onSkip()";
            }

            end();
        }

        // Установить прелоадер
        QuickTip.prototype.setPreloader = function(html) {

            let temp = document.createElement("div");
                temp.innerHTML = html;
                temp = temp.childNodes[1];

            preloaderUser = temp;
        }

        function checkToDoPrevious(array, step = 0) {
            
            let result = {
                id: 0,
                bool: false
            };

            step = step - 1;
            if(step < 0) step = 0;

            for(let i = step; i >= 0; i--) {

                if(getObject(array[i].object) !== null) {
                    result.id = i;
                    result.bool = true;
                    break; 
                }
            }

            return result;
        }

        function getWidthDocument() {

            return document.body.scrollWidth;
        }

        function getHeightDocument() {
            
            return document.body.scrollHeight;
        }

        function getWidthWindow() {

            return document.documentElement.clientWidth;
        }

        function getHeightWindow() {

            return document.documentElement.clientHeight;
        }

        function getObject(className) {

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

                    if(object === undefined) object = null;
                }
                
                // querySelector возвращает null, если не найдено
                else object = document.querySelector(className); 

                return object;
            }
        }

        function getObjectCoordinate(object) {

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
        
            else return null;
        }
        
        function initTemplate(html) {

            if(template === null) {

                let temp = document.createElement("div");
                temp.innerHTML = html;
                temp = temp.childNodes[1];

                title = temp.querySelector("#quickTip_title");

                text = temp.querySelector("#quickTip_text");

                button_stop = temp.querySelector("#quickTip_stop");
                if(button_stop != null) button_stop.onclick = function() { that.skip(); }

                button_next = temp.querySelector("#quickTip_next");
                if(button_next != null) button_next.onclick = function() { that.nextStep(); }

                button_previous = temp.querySelector("#quickTip_previous");
                if(button_previous != null) button_previous.onclick = function() { that.previousStep(); }

                indicator = temp.querySelector("#quickTip_indicator");

                template = temp;

                templateCSS = temp.style;
            }
        }

        function setTemplateData(data) {

            // Титульник
            if(data.title === undefined && title != null) title.innerHTML = "";
            else if(title != null) title.innerHTML = data.title;
        
            // Основной текст
            if(data.text === undefined && text != null) text.innerHTML = "";
            else if(text != null) text.innerHTML = data.text;

            // Кнопка стоп
            if(data.button_stop === undefined && button_stop != null) button_stop.innerHTML = "Пропустить";
            else if(button_stop != null) button_stop.innerHTML = data.button_stop;

            // Кнопка далее
            if(data.button_next === undefined && button_next != null) button_next.innerHTML = "Далее";
            else if(button_next != null) button_next.innerHTML = data.button_next;

            // Индикатор
            if(data.indicator === undefined && indicator != null) indicator.innerHTML = that.getStep() + 1 + " из " + dataArray.length;
            else if(indicator != null) indicator.innerHTML = data.indicator;
        }

        function getTemplateCoordinate() {
            
            if(template !== null) {

                objectClientRect = template.getBoundingClientRect();
        
                let coordinate = objectClientRect;

                coordinate.OffsetTop = coordinate.top + pageYOffset;

                coordinate.OffsetBottom = coordinate.bottom + pageYOffset;

                coordinate.OffsetLeft = coordinate.left + pageXOffset;

                coordinate.OffsetRight = coordinate.right + pageXOffset;
                
                coordinate.centerTop = coordinate.top + pageYOffset + coordinate.height / 2;

                coordinate.centerLeft = coordinate.left + pageXOffset + coordinate.width / 2;
            
                return coordinate;
            }

            else return null;
        }

        function setTemplateTarget(coordinateObject, coordinateTemplate) {

            setTimeout(function() {

                if(!that.templateDefaultPosition) {

                    template.style.transform = "translate(0px, 0px)";

                    // Разрешенная зона
                    let allowRange = coordinateTemplate.width + that.MARGIN_OBJECT;

                    // Отступы объекта
                    let margin_left = coordinateObject.OffsetLeft,
                        margin_right = getWidthDocument() - coordinateObject.OffsetRight;

                    // Если малеький экран
                    if(getWidthDocument() < 374) {

                        allowRange = allowRange / 2;  
                    }

                    // Cередина на маленьких экранах (Должно перебить условие "Самый левый блок")
                    if(coordinateObject.centerLeft === getWidthDocument() / 2) {

                        template.style.left = coordinateObject.centerLeft - coordinateTemplate.width / 2 + that.offset.left + "px";
                    }

                    // Самый левый блок
                    else if(coordinateObject.centerLeft < allowRange) {

                        // Если вплотную к экрану
                        if(coordinateObject.OffsetLeft < 10) template.style.left = coordinateObject.OffsetLeft + 10 + that.offset.left + "px";
                        
                        else template.style.left = coordinateObject.OffsetLeft - margin_left / 2 + that.offset.left + "px";
                    }

                    // Самый правый блок
                    else if(coordinateObject.centerLeft > getWidthDocument() - allowRange) {

                        // Если вплотную к экрану
                        if(coordinateObject.OffsetLeft > getWidthDocument() - 10) template.style.left = coordinateObject.OffsetRight - coordinateTemplate.width - 10 + that.offset.left + "px";

                        else template.style.left = coordinateObject.OffsetRight - coordinateTemplate.width + margin_right / 2 + that.offset.left + "px";
                    }

                    // Середина
                    else {

                        template.style.left = coordinateObject.centerLeft - coordinateTemplate.width / 2 + that.offset.left + "px";
                    }
                    
                    // Если блок снизу
                    if(coordinateObject.OffsetTop > getHeightDocument() - coordinateTemplate.height - that.MARGIN_OBJECT * 2) {

                        tailTopBool = false; tailBottomBool = true;
                        
                        template.style.top = coordinateObject.OffsetTop - coordinateTemplate.height - that.MARGIN_OBJECT * 2 + that.offset.top + "px";
                    }
    
                    else {

                        tailTopBool = true; tailBottomBool = false; 
            
                        template.style.top = coordinateObject.OffsetTop + coordinateObject.height + that.MARGIN_OBJECT * 2 + that.offset.top + "px";
                    }

                    // Если темлейт не влезает из-за большой цели
                    if(getHeightWindow() / 1.3 - coordinateTemplate.height < coordinateObject.height) {

                        template.style.top = coordinateObject.centerTop + that.offset.top +  "px";
                    }

                    object.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
                }

                else template.style = templateCSS;
            }, 200);
        }

        function renderTemplate() {
        
            if(templateRender === false) {

                document.body.append(template);
                templateRender = true;
            }
        }

        function destroyTemplate() {

            if(template !== null) { template.remove(); template = null; }
            
            templateRender = false;
        }

        function initBlocks() {

            if(blockLeft === null && blockTop === null && blockRight === null && blockBottom === null) { 
                
                _position = (getHeightDocument() < window.innerHeight) ? "fixed" : "absolute";

                blockLeft = document.createElement("div");
                blockTop = document.createElement("div");
                blockRight = document.createElement("div");
                blockBottom = document.createElement("div");

                blockLeft.style.backgroundColor = that.blocksColor;
                blockLeft.style.opacity = that.blocksOpacity;
                blockLeft.style.zIndex = that.blocksZ;

                blockLeft.style.position = _position;
                blockLeft.style.left = "0px";
                blockLeft.style.top = "0px";
                blockLeft.style.right = "0px";
                blockLeft.style.bottom = "0px";

                blockTop.style.backgroundColor = that.blocksColor;
                blockTop.style.opacity = that.blocksOpacity;
                blockTop.style.zIndex = that.blocksZ;

                blockTop.style.position = _position;
                blockTop.style.left = "0px";
                blockTop.style.top = "0px";
                blockTop.style.right = "0px";
                blockTop.style.bottom = "0px";

                blockRight.style.backgroundColor = that.blocksColor;
                blockRight.style.opacity = that.blocksOpacity;
                blockRight.style.zIndex = that.blocksZ;

                blockRight.style.position = _position;
                blockRight.style.left = "0px";
                blockRight.style.top = "0px";
                blockRight.style.right = "0px";
                blockRight.style.bottom = "0px";

                blockBottom.style.backgroundColor = that.blocksColor;
                blockBottom.style.opacity = that.blocksOpacity;
                blockBottom.style.zIndex = that.blocksZ;

                blockBottom.style.position = _position;
                blockBottom.style.left = "0px";
                blockBottom.style.top = "0px";
                blockBottom.style.right = "0px";
                blockBottom.style.bottom = "0px";
            } 
            
            else {

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
        
        function setBlocksTarget(coordinateObject) {
        
            // TOP
            let top_position = coordinateObject.OffsetTop - that.MARGIN_OBJECT;
            blockTop.style.height = ((top_position > 0) ? top_position : 0) + "px";
            blockTop.style.bottom = "unset";
            
            // BOTTOM
            let bottom_position = (_position === "absolute") ? getHeightDocument() - (coordinateObject.OffsetTop + coordinateObject.height + that.MARGIN_OBJECT) : window.innerHeight - (coordinateObject.OffsetTop + coordinateObject.height + that.MARGIN_OBJECT);
            blockBottom.style.height = ((bottom_position > 0) ? bottom_position : 0)  + "px";
            blockBottom.style.top = "unset";
        
            // LEFT
            let left_position = coordinateObject.OffsetLeft - that.MARGIN_OBJECT;
            blockLeft.style.width = ((left_position> 0) ? left_position : 0) + "px";
            blockLeft.style.top = top_position + "px";
            blockLeft.style.bottom = bottom_position + "px";
            blockLeft.style.right = "unset";
        
            // RIGHT
            let right_position = getWidthDocument() - (coordinateObject.OffsetLeft + that.MARGIN_OBJECT + coordinateObject.width);
            blockRight.style.width = ((right_position > 0) ? right_position : 0) + "px";
            blockRight.style.top = top_position + "px";
            blockRight.style.bottom = bottom_position + "px";
            blockRight.style.left = "unset";
        }
        
        function renderBlocks() {
        
            if(blocksRender === false) {
        
                document.body.append(blockLeft);
                document.body.append(blockTop);
                document.body.append(blockRight);
                document.body.append(blockBottom);

                blocksRender = true;
            }
        }
        
        function destroyBlocks() {
        
            if(blockLeft !== null) { blockLeft.remove(); blockLeft = null; }
            if(blockTop !== null) { blockTop.remove(); blockTop = null; }
            if(blockRight !== null) { blockRight.remove(); blockRight = null; }
            if(blockBottom !== null) { blockBottom.remove(); blockBottom = null; }

            blocksRender = false;
        }

        function initTrigger() {

            if(trigger === null) {

                trigger = document.createElement("div");

                trigger.style.position = "absolute";
                trigger.style.left = "0px";
                trigger.style.top = "0px";
                trigger.style.right = "0px";
                trigger.style.bottom = "0px";

                // trigger.style.backgroundColor = "#00ff00";
                // trigger.style.opacity = "1";

                trigger.style.zIndex = "9970";
            }

            else {

                let trigger_temp = trigger.cloneNode(true);

                destroyTrigger();

                trigger = trigger_temp;

                trigger.style.zIndex = "9970";
            };
        }
        
        function setTriggerTarget(coordinateObject) {

            trigger.style.width = coordinateObject.width + "px";
            trigger.style.height = coordinateObject.height + "px";
            trigger.style.top = coordinateObject.OffsetTop + "px";
            trigger.style.left = coordinateObject.OffsetLeft + "px";
            trigger.style.right = "unset";
            trigger.style.bottom = "unset";
            trigger.style.cursor = "pointer";
            trigger.addEventListener("click", onTriggerClick, false);
        }

        function renderTrigger() {

            if(that.triggerActive) document.body.append(trigger);

            else destroyTrigger();
        }

        function destroyTrigger() { 

            if(trigger != null) { trigger.remove(); trigger = null; }
        }

        function initTail() {
        
            if(tail === null) {

                if(tailTemp === null) tailTemp = document.querySelector("#quickTip_tail");

                if(tailTemp !== null) {

                    tail = tailTemp;
                    tail.style.position = "absolute";
                    tail.remove();
                } 

                else that.tailActive = false;
            }
        }

        function setTailCoordinate(coordinateObject, coordinateTemplate) {
            
            if(that.tailActive) {

                tail.style.left = coordinateObject.centerLeft - 10 + "px";

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
        
        function renderTail() {
        
            if(that.tailActive && tailRender === false) {
        
                document.body.append(tail);
        
                tailRender = true;
            }
        }
        
        function destroyTail() {
        
            if(tail !== null) { tail.remove(); tail = null; }

            tailRender = false;
        }

        function initPreloader() {

            if(preloader === null) preloader = preloaderUser;
        }

        function renderPreloader() {

            if(preloaderRender === false) {

                document.body.append(preloader);

                preloaderRender = true;
            }
        }

        function destroyPreloader() {

            if(preloader != null) { preloader.remove(); preloader = null; }

            preloaderRender = false;
        }

        function end() {

            destroyTemplate();
            destroyTail();
            destroyBlocks();
            destroyPreloader();
            destroyTrigger();

            document.body.style.overflow = 'auto';
            document.body.style.userSelect = "auto";

            run = false;

            stepNextBool = false;
            stepPrevious = false;

            if(objectOld !== null) objectOld.removeEventListener("click", objectClick, false);
        }

        let onresize_bool = false,
            timerId = null;
        
        window.onresize = function(event) { 

            onresize_bool = true;

            clearTimeout(timerId);

            if(run && dataArray.length > 0 && onresize_bool) {

                destroyTemplate();
                destroyTail();
                destroyBlocks();

                timerId = setTimeout(function() {
                    
                    that.step(false);

                    onresize_bool = false;
                }, 600);
            } 
        }
        
        window.onkeydown = function(event) {

            event = event || window.event;

            if(run && event.keyCode > 36 && event.keyCode < 41 || event.keyCode > 32 && event.keyCode < 37) return false; 
        }
    };

    window.QuickTip = QuickTip;
})(window);