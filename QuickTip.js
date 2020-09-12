(function(window) {

    var QuickTip = function(html, options = null) {

        let that = this;

        let quickTipData = [],
            quickTipRun = false;
     
        // Поля темплейта
        let template = null,
            templateRender = false,
            templateCSS = null,
            templateTitle = "Текст",
            templateText = "Какой-то текст",
            templateButtonStop = null,
            templateButtonNext = null,
            templateButtonPrevious = null,
            templateIndicator = "1 из 3";;

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
            blockRender = false,
            blockPosition = "absolute";

        let trigger = null,
            triggerOnClick = null;

        let preloader = null
            preloaderUser = null,
            preloaderRender = false,
            preloaderIteration = 0;

        let stepNextBool = false,
            stepPrevious = false,
            stepIteration = 0;

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

            if(stepIteration < quickTipData.length - 1) { 

                stepNextBool = true;
                stepPrevious = false;

                if(objectOld !== null) objectOld.removeEventListener("click", objectClick, false);

                // options.onNext()
                if(options != null && options.onNext !== undefined) {

                    if(typeof options.onNext === "function") options.onNext();

                    else throw "Неверно объявлена функция onNext()";
                }

                stepIteration++;
                preloaderIteration = 0;
                
                this.step(); 
            }

            else this.stop();
        }
        
        // Предыдущий шаг
        QuickTip.prototype.previousStep = function() {

            if(objectOld !== null) objectOld.removeEventListener("click", objectClick, false);
            
            if(stepIteration > 0) {

                stepNextBool = false;
                stepPrevious = true;

                // options.onPrevious()
                if(options != null && options.onPrevious !== undefined) {

                    if(typeof options.onPrevious === "function") options.onPrevious();

                    else throw "Неверно объявлена функция onPrevious()";
                }

                stepIteration--;
                preloaderIteration = 0;  

                this.step();
            }
        }
        
        // Установить шаг
        QuickTip.prototype.setStep = function(step, bool = false) {

            stepIteration = step;

            if(bool) this.step();
        }
        
        // Получить шаг
        QuickTip.prototype.getStep = function() {

            return stepIteration;
        }
        
        // Выполнить шаг
        QuickTip.prototype.step = function(eventActive = true) {
        
            if(quickTipRun && quickTipData.length > 0 && html != null) {

                // Это глобальные и локальные настройки (ПЕРЕДЕЛАТЬ)
                // this.blocksColor
                if(options != null && options.blocksColor != undefined) this.blocksColor = options.blocksColor;
                if(quickTipData[stepIteration].blocksColor != undefined) this.blocksColor = quickTipData[stepIteration].blocksColor;
                if((options === null || options.blocksColor === undefined) && quickTipData[stepIteration].blocksColor === undefined) this.blocksColor = "#0f0f0f";

                // this.blocksOpacity
                if(options != null && options.blocksOpacity != undefined) this.blocksOpacity = options.blocksOpacity;
                if(quickTipData[stepIteration].blocksOpacity != undefined) this.blocksOpacity = quickTipData[stepIteration].blocksOpacity;
                if((options === null || options.blocksOpacity === undefined) && quickTipData[stepIteration].blocksOpacity === undefined) this.blocksOpacity = "0.5";

                // this.blocksZ
                if(options != null && options.blocksZ != undefined) this.blocksZ = options.blocksZ;
                if(quickTipData[stepIteration].blocksZ != undefined) this.blocksZ = quickTipData[stepIteration].blocksZ;
                if((options === null || options.blocksZ === undefined) && quickTipData[stepIteration].blocksZ === undefined) this.blocksZ = "9000";

                // this.templateDefaultPosition
                if(options != null && options.templateDefaultPosition != undefined) this.templateDefaultPosition = options.templateDefaultPosition;
                if(quickTipData[stepIteration].templateDefaultPosition != undefined) this.templateDefaultPosition = quickTipData[stepIteration].templateDefaultPosition;
                if((options === null || options.templateDefaultPosition === undefined) && quickTipData[stepIteration].templateDefaultPosition === undefined) this.templateDefaultPosition = false;

                // this.delay
                if(options != null && options.delay != undefined) this.delay = options.delay;
                if(quickTipData[stepIteration].delay != undefined) this.delay = quickTipData[stepIteration].delay;
                if((options === null || options.delay === undefined) && quickTipData[stepIteration].delay === undefined) this.delay = 200;

                // MARGIN_OBJECT
                if(options != null && options.MARGIN_OBJECT != undefined) this.MARGIN_OBJECT = options.MARGIN_OBJECT;
                if(quickTipData[stepIteration].MARGIN_OBJECT != undefined) this.MARGIN_OBJECT = quickTipData[stepIteration].MARGIN_OBJECT;
                if((options === null || options.MARGIN_OBJECT === undefined) && quickTipData[stepIteration].MARGIN_OBJECT === undefined) this.MARGIN_OBJECT = 4;

                // blocksActive
                if(options != null && options.blocksActive != undefined) this.blocksActive = options.blocksActive;
                if(quickTipData[stepIteration].blocksActive != undefined) this.blocksActive = quickTipData[stepIteration].blocksActive;
                if((options === null || options.blocksActive === undefined) && quickTipData[stepIteration].blocksActive === undefined) this.blocksActive = true;

                // tailActive
                if(options != null && options.tailActive != undefined) this.tailActive = options.tailActive;
                if(quickTipData[stepIteration].tailActive != undefined) this.tailActive = quickTipData[stepIteration].tailActive;
                if((options === null || options.tailActive === undefined) && quickTipData[stepIteration].tailActive === undefined) this.tailActive = true;

                // buttonStopActive 
                if(options != null && options.buttonStopActive != undefined) this.buttonStopActive = options.buttonStopActive;
                if(quickTipData[stepIteration].buttonStopActive != undefined) this.buttonStopActive = quickTipData[stepIteration].buttonStopActive;
                if((options === null || options.buttonStopActive === undefined) && quickTipData[stepIteration].buttonStopActive === undefined) this.buttonStopActive = true;

                // buttonNextActive
                if(options != null && options.buttonNextActive != undefined) this.buttonNextActive = options.buttonNextActive;
                if(quickTipData[stepIteration].buttonNextActive != undefined) this.buttonNextActive = quickTipData[stepIteration].buttonNextActive;
                if((options === null || options.buttonNextActive === undefined) && quickTipData[stepIteration].buttonNextActive === undefined) this.buttonNextActive = true;

                // buttonPreviousActive 
                if(options != null && options.buttonPreviousActive != undefined) this.buttonPreviousActive = options.buttonPreviousActive;
                if(quickTipData[stepIteration].buttonPreviousActive != undefined) this.buttonPreviousActive = quickTipData[stepIteration].buttonPreviousActive;
                if((options === null || options.buttonPreviousActive === undefined) && quickTipData[stepIteration].buttonPreviousActive === undefined) this.buttonPreviousActive = true;

                // triggerActive
                if(options != null && options.triggerActive != undefined) this.triggerActive = options.triggerActive;
                if(quickTipData[stepIteration].triggerActive != undefined) this.triggerActive = quickTipData[stepIteration].triggerActive;
                if((options === null || options.triggerActive === undefined) && quickTipData[stepIteration].triggerActive === undefined) this.triggerActive = true;

                // offset
                if(options != null && options.offset != undefined) this.offset = options.offset;
                if(quickTipData[stepIteration].offset != undefined) this.offset = quickTipData[stepIteration].offset;
                if((options === null || options.offset === undefined) && quickTipData[stepIteration].offset === undefined) this.offset = { left: 0, top: 0 };

                // errorTimeout
                if(options != null && options.errorTimeout != undefined) this.errorTimeout = options.errorTimeout;
                if(quickTipData[stepIteration].errorTimeout != undefined) this.errorTimeout = quickTipData[stepIteration].errorTimeout;
                if((options === null || options.errorTimeout === undefined) && quickTipData[stepIteration].errorTimeout === undefined) this.errorTimeout = 4;

                // quickTipData.onStep()
                if(quickTipData[stepIteration].onStep !== undefined && eventActive) {

                    if(typeof quickTipData[stepIteration].onStep === "function") quickTipData[stepIteration].onStep();
    
                    else throw "Неверно объявлена функция onStep()";
                }

                // options.onStep()
                else if(options != null && options.onStep !== undefined && eventActive) {

                    if(typeof options.onStep === "function") options.onStep();

                    else throw "Неверно объявлена функция onStep()";
                }
                
                setTimeout(() => {
                    
                    object = getObject(quickTipData[stepIteration].object);
                    objectCoordinate = getObjectCoordinate(object);
            
                    if(objectCoordinate === null) {

                        if(preloaderUser === null) {

                            // options.onStepError()
                            if(options != null && options.onStepError !== undefined && eventActive) {

                                if(typeof options.onStepError === "function") options.onStepError();
                
                                else throw "Неверно объявлена функция onStepError()";
                            }

                            if(stepNextBool) { this.nextStep(); throw 'Шаг с элементом "' + quickTipData[stepIteration - 1].object + '" не найден и будет пропущен.'; } 

                            if(stepPrevious) { 

                                let check = checkToDoPrevious(quickTipData, stepIteration + 1);
                                
                                if(check.bool) {

                                    this.setStep(check.id, true); 
                                    throw 'Шаг с элементом "' + quickTipData[stepIteration + 1].object + '" не найден и будет пропущен.'; 
                                }

                                else { 

                                    this.setStep(stepIteration + 1, true); 
                                    throw 'Шаг с элементом "' + quickTipData[stepIteration - 1].object + '" не найден и будет пропущен.'; 
                                }
                            }

                            if(!stepNextBool && !stepPrevious) { that.nextStep(); throw 'Шаг с элементом "' + quickTipData[stepIteration - 1].object + '" не найден и будет пропущен.'; }
                        }

                        else {

                            initPreloader();
                            renderPreloader();

                            setTimeout(function() {

                                if(!quickTipRun) return;
                            
                                preloaderIteration++;
    
                                // Выполняется, когда время кончится
                                if(preloaderIteration > that.errorTimeout) {
    
                                    // options.onStepError()
                                    if(options != null && options.onStepError !== undefined && eventActive) {
    
                                        if(typeof options.onStepError === "function") options.onStepError();
                        
                                        else throw "Неверно объявлена функция onStepError()";
                                    }
    
                                    if(!quickTipRun) return;
                                    
                                    if(stepNextBool) { that.nextStep(); throw 'Шаг с элементом "' + quickTipData[stepIteration - 1].object + '" не найден и будет пропущен.'; } 
    
                                    if(stepPrevious) {

                                        let check = checkToDoPrevious(quickTipData, stepIteration + 1);
                                
                                        if(check.bool) {

                                            that.setStep(check.id, true); 
                                            throw 'Шаг с элементом "' + quickTipData[stepIteration + 1].object + '" не найден и будет пропущен.'; 
                                        }

                                        else { 
                                            
                                            that.setStep(stepIteration + 1, true); 
                                            throw 'Шаг с элементом "' + quickTipData[stepIteration - 1].object + '" не найден и будет пропущен.'; 
                                        }
                                    }
    
                                    if(!stepNextBool && !stepPrevious) { that.nextStep(); throw 'Шаг с элементом "' + quickTipData[stepIteration - 1].object + '" не найден и будет пропущен.'; }
                                }
    
                                that.step();
                            }, 1000);
                        }
                    }

                    else {
                        
                        destroyPreloader();
                        destroyTail();

                        // quickTipData.onClick()
                        if(quickTipData[stepIteration].onClick !== undefined && eventActive) {
   
                            if(typeof quickTipData[stepIteration].onClick === "function") objectClick = quickTipData[stepIteration].onClick;

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
                        setTemplateData(quickTipData[stepIteration]);

                        if(!this.triggerActive) destroyTrigger();

                        if(this.triggerActive) {

                            // quickTipData.triggerOnClick()
                            if(quickTipData[stepIteration].triggerOnClick !== undefined) {

                                if(typeof quickTipData[stepIteration].triggerOnClick === "function") triggerOnClick = quickTipData[stepIteration].triggerOnClick;
                
                                else throw "Неверно объявлена функция triggerOnClick()";
                            }

                            // options.triggerOnClick()
                            else if(options != null && options.triggerOnClick !== undefined) {

                                if(typeof options.triggerOnClick === "function") triggerOnClick = options.triggerOnClick;
                
                                else throw "Неверно объявлена функция triggerOnClick()";
                            }

                            initTrigger();
                            setTriggerTarget(objectCoordinate);
                            renderTrigger();
                        }

                        templateButtonStop.style.display = this.buttonStopActive ? "block" : "none";
                        templateButtonNext.style.display = this.buttonNextActive ? "block" : "none";
                        templateButtonPrevious.style.display = this.buttonPreviousActive ? "block" : "none";
                
                        if(!this.blocksActive && blockRender) destroyBlocks();
                        
                        if(this.blocksActive) {
                            
                            initBlocks();
                            setBlocksTarget(objectCoordinate);
                            renderBlocks();
                        }
                        
                        if(!this.tailActive && blockRender) destroyTail();

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
        QuickTip.prototype.run = function(step = null) {

            document.body.style.position = "relative";
            document.body.style.overflow = 'hidden';
            document.body.style.userSelect = "none";

            // onStart()
            if(!preloaderRender && options != null && options.onStart !== undefined) {

                if(typeof options.onStart === "function") options.onStart();

                else throw "Неверно объявлена функция onStart()";
            }

            quickTipRun = true;
            
            if(step === null) this.setStep(0);

            else this.setStep(step);

            this.step();
        }

        // Задать сценарий
        QuickTip.prototype.set = function(data) {

            quickTipData = data;

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

        function getDocumentWidth() {

            return document.body.scrollWidth;
        }

        function getDocumentHeight() {
            
            return document.body.scrollHeight;
        }

        function getWindowWidth() {

            return document.documentElement.clientWidth;
        }

        function getWindowHeight() {

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

        function setTemplateData(data) {

            // Титульник
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

        function getTemplateCoordinate() {
            
            if(template !== null) {
                
                let coordinate = null;

                coordinate = objectClientRect = template.getBoundingClientRect();
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

        function setTemplateTarget(objectСoordinate, coordinateTemplate) {

            setTimeout(function() {

                if(!that.templateDefaultPosition) {

                    template.style.transform = "translate(0px, 0px)";

                    // Разрешенная зона
                    let allowRange = coordinateTemplate.width + that.MARGIN_OBJECT;

                    // Отступы объекта
                    let marginLeft = objectСoordinate.OffsetLeft,
                        marginRight = getDocumentWidth() - objectСoordinate.OffsetRight;

                    // Если малеький экран
                    if(getDocumentWidth() < 374) {

                        allowRange = allowRange / 2;  
                    }

                    // Cередина на маленьких экранах (Должно перебить условие "Самый левый блок")
                    if(objectСoordinate.centerLeft === getDocumentWidth() / 2) {

                        template.style.left = objectСoordinate.centerLeft - coordinateTemplate.width / 2 + that.offset.left + "px";
                    }

                    // Самый левый блок
                    else if(objectСoordinate.centerLeft < allowRange) {

                        // Если вплотную к экрану
                        if(objectСoordinate.OffsetLeft < 10) template.style.left = objectСoordinate.OffsetLeft + 10 + that.offset.left + "px";
                        
                        else template.style.left = objectСoordinate.OffsetLeft - marginLeft / 2 + that.offset.left + "px";
                    }

                    // Самый правый блок
                    else if(objectСoordinate.centerLeft > getDocumentWidth() - allowRange) {

                        // Если вплотную к экрану
                        if(objectСoordinate.OffsetLeft > getDocumentWidth() - 10) template.style.left = objectСoordinate.OffsetRight - coordinateTemplate.width - 10 + that.offset.left + "px";

                        else template.style.left = objectСoordinate.OffsetRight - coordinateTemplate.width + marginRight / 2 + that.offset.left + "px";
                    }

                    // Середина
                    else {

                        template.style.left = objectСoordinate.centerLeft - coordinateTemplate.width / 2 + that.offset.left + "px";
                    }
                    
                    // Если блок снизу
                    if(objectСoordinate.OffsetTop > getDocumentHeight() - coordinateTemplate.height - that.MARGIN_OBJECT * 2) {

                        tailTopBool = false;
                        tailBottomBool = true;
                        
                        template.style.top = objectСoordinate.OffsetTop - coordinateTemplate.height - that.MARGIN_OBJECT * 2 + that.offset.top + "px";
                    }
    
                    else {

                        tailTopBool = true;
                        tailBottomBool = false;
            
                        template.style.top = objectСoordinate.OffsetTop + objectСoordinate.height + that.MARGIN_OBJECT * 2 + that.offset.top + "px";
                    }

                    // Если темлейт не влезает из-за большой цели
                    if(getWindowHeight() / 1.3 - coordinateTemplate.height < objectСoordinate.height) {

                        template.style.top = objectСoordinate.centerTop + that.offset.top +  "px";
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

            if(template !== null) {
                template.remove();
                template = null;
            }
            
            templateRender = false;
        }

        function initBlocks() {

            if(blockLeft === null && blockTop === null && blockRight === null && blockBottom === null) { 
                
                blockPosition = (getDocumentHeight() < window.innerHeight) ? "fixed" : "absolute";

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
        
        function setBlocksTarget(objectСoordinate) {
        
            // TOP
            let topPosition = objectСoordinate.OffsetTop - that.MARGIN_OBJECT;
            blockTop.style.height = ((topPosition > 0) ? topPosition : 0) + "px";
            blockTop.style.bottom = "unset";
            
            // BOTTOM
            let bottomPosition = (blockPosition === "absolute") ? getDocumentHeight() - (objectСoordinate.OffsetTop + objectСoordinate.height + that.MARGIN_OBJECT) : window.innerHeight - (objectСoordinate.OffsetTop + objectСoordinate.height + that.MARGIN_OBJECT);
            blockBottom.style.height = ((bottomPosition > 0) ? bottomPosition : 0)  + "px";
            blockBottom.style.top = "unset";
        
            // LEFT
            let leftPosition = objectСoordinate.OffsetLeft - that.MARGIN_OBJECT;
            blockLeft.style.width = ((leftPosition> 0) ? leftPosition : 0) + "px";
            blockLeft.style.top = topPosition + "px";
            blockLeft.style.bottom = bottomPosition + "px";
            blockLeft.style.right = "unset";
        
            // RIGHT
            let rightPosition = getDocumentWidth() - (objectСoordinate.OffsetLeft + that.MARGIN_OBJECT + objectСoordinate.width);
            blockRight.style.width = ((rightPosition > 0) ? rightPosition : 0) + "px";
            blockRight.style.top = topPosition + "px";
            blockRight.style.bottom = bottomPosition + "px";
            blockRight.style.left = "unset";
        }
        
        function renderBlocks() {
        
            if(blockRender === false) {
        
                document.body.append(blockLeft);
                document.body.append(blockTop);
                document.body.append(blockRight);
                document.body.append(blockBottom);

                blockRender = true;
            }
        }
        
        function destroyBlocks() {
        
            if(blockLeft !== null) { blockLeft.remove(); blockLeft = null; }
            if(blockTop !== null) { blockTop.remove(); blockTop = null; }
            if(blockRight !== null) { blockRight.remove(); blockRight = null; }
            if(blockBottom !== null) { blockBottom.remove(); blockBottom = null; }

            blockRender = false;
        }

        function initTrigger() {

            if(trigger === null) {

                trigger = document.createElement("div");
                trigger.style.position = "absolute";
                trigger.style.left = "0px";
                trigger.style.top = "0px";
                trigger.style.right = "0px";
                trigger.style.bottom = "0px";
                trigger.style.zIndex = "9970";
            }

            else {

                let triggerTemp = trigger.cloneNode(true);

                destroyTrigger();

                trigger = triggerTemp;
                trigger.style.zIndex = "9970";
            };
        }
        
        function setTriggerTarget(objectСoordinate) {

            trigger.style.width = objectСoordinate.width + "px";
            trigger.style.height = objectСoordinate.height + "px";
            trigger.style.top = objectСoordinate.OffsetTop + "px";
            trigger.style.left = objectСoordinate.OffsetLeft + "px";
            trigger.style.right = "unset";
            trigger.style.bottom = "unset";
            trigger.style.cursor = "pointer";
            trigger.addEventListener("click", triggerOnClick, false);
        }

        function renderTrigger() {

            if(that.triggerActive) document.body.append(trigger);

            else destroyTrigger();
        }

        function destroyTrigger() { 

            if(trigger != null) { 
                trigger.remove(); 
                trigger = null; 
            }
        }

        function initTail() {
        
            if(tail === null) {

                if(tailTemp === null) tailTemp = document.querySelector("#quick-tip-tail");

                if(tailTemp !== null) {

                    tail = tailTemp;
                    tail.style.position = "absolute";
                    tail.remove();
                } 

                else that.tailActive = false;
            }
        }

        function setTailCoordinate(objectСoordinate, coordinateTemplate) {
            
            if(that.tailActive) {

                tail.style.left = objectСoordinate.centerLeft - 10 + "px";

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
        
            if(tail !== null) {
                tail.remove();
                tail = null;
            }

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

            if(preloader != null) { 
                preloader.remove(); 
                preloader = null; 
            }

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

            quickTipRun = false;

            stepNextBool = false;
            stepPrevious = false;

            if(objectOld !== null) objectOld.removeEventListener("click", objectClick, false);
        }

        let onresizeBool = false,
            timerId = null;
        
        window.onresize = function(event) {

            onresizeBool = true;

            clearTimeout(timerId);

            if(quickTipRun && quickTipData.length > 0 && onresizeBool) {

                destroyTemplate();
                destroyTail();
                destroyBlocks();

                timerId = setTimeout(function() {
                    
                    that.step(false);

                    onresizeBool = false;
                }, 600);
            } 
        }
        
        window.onkeydown = function(event) {

            event = event || window.event;

            if(quickTipRun && event.keyCode > 36 && event.keyCode < 41 || event.keyCode > 32 && event.keyCode < 37) return false; 
        }
    };

    window.QuickTip = QuickTip;
})(window);