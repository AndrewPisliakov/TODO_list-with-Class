
class Todo {
    constructor(data) {
        this._data = data ?? []; // посмотреть ?? 
        this._readonly = false;

        /*        let todo = new Todo();
                let todo = {
                    _data: [],
                    _readonly: false,
                    add(text) {
                        this._data === todo.data;
                    }
                }
                let todo2 = new Todo();
                let todo2 = {
                    _data: [],
                    _readonly: false,  
                    add(text) {
                        this._data === todo2.data;
                    }
                } */
    }

    addItem(text) {
        if (this._readonly == true) {
            alert('Список только для чтения. Добавление, изменение ЗАПРЕЩЕНО');
            console.log(this._data);
            return;
        }

        let result = this._data.find(elem => elem.text == text);

        if (result) { //если есть значение то
            throw new Error('Такое дело уже есть');
        }

        this._data.push({
            id: Date.now(),
            text: text,
            completed: false,
            readonly: false
        });

        this._triggerEvent('change');

        console.log(this._data);
    }

    changeItemText(id, text) {
        if (this._readonly == true) {
            alert('Список только для чтения. Изменение ЗАПРЕЩЕНО');
            console.log(this._data);
            return;
        }

        let result = this._data.find(elem => elem.id == id);

        if (result.readonly == true) {
            alert('Этот элемент только для чтения. Изменение ЗАПРЕЩЕНО');
            console.log(this._data);
            return;
        }

        result.text = text;

        this._triggerEvent('change');

        console.log(this._data);
    }

    deleteItem(id) {   //  ГОТОВО
        if (this._readonly == true) {
            alert('Список только для чтения. Удаление ЗАПРЕЩЕНО');
            console.log(this._data);
            return;
        }


        let result = this._data.find(elem => elem.id == id);

        if (!result) {
            console.log('Такого элемента нет');
            return;
        } else if (result.readonly == true) {
            console.log('Элемент только для чтения. Удаление невозможно');
            return
        }

        let numIndex = this._data.findIndex(elem => elem.id == id);

        this._data.splice(numIndex, 1);

        this._triggerEvent('change');

        console.log(this._data);

    }

    clear() {   //--ГОТОВО--
        if (this._readonly == true) {
            alert('Список только для чтения. Добавление, изменение ЗАПРЕЩЕНО');
            console.log(this._data);
            return;
        }

        let boolean = this._data.some(elem => elem.readonly == true);

        if (boolean == true) {
            alert('Удаление невозможно, один из объектов только для чтения');
            console.log(this._data);
            return
        }

        this._data = [];

        this._triggerEvent('change');

        console.log(this._data);
    }

    getAllItems() {   //      --ГОТОВО--
        return JSON.parse(JSON.stringify(this._data));
    }

    isReadonly() {
        return this._readonly;
    }

    makeReadonly() { // только для чтения       --ГОТОВО--
        this._readonly = true;

        this._triggerEvent('change');

        console.log(this._data);
    }

    makeItemReadonly(id) {                      // ГОТОВО
        let result = this._data.find(elem => elem.id == id);

        if (result) {
            result.readonly = true;

            this._triggerEvent('change');
        }

        console.log(this._data);
    }

    makeEditable() {
        this._readonly = false;

        this._triggerEvent('change');
    }

    makeItemEditable(id) { //  ГОТОВО
        let result = this._data.find(elem => elem.id == id);

        if (result) {
            result.readonly = false;

            this._triggerEvent('change');
        }

        

        console.log(this._data);
    }

    makeItemCompleted(id) {
        let result = this._data.find(elem => elem.id == id);

        result.completed = true;
       
        this._triggerEvent('change');

        console.log(this._data);
    }

    makeItemUnCompleted(id) {
        let result = this._data.find(elem => elem.id == id);

        result.completed = false;
        
        this._triggerEvent('change');

        console.log(this._data);
    }

    addEventListener(eventName, func) {
        window.addEventListener(`model: ${eventName}`, func);
    }

    removeEventListener(eventName, func) {
        window.removeEventListener(`model: ${eventName}`, func);
    }

    _triggerEvent(eventName) {                                      // прописали свое событие
        window.dispatchEvent(new Event(`model: ${eventName}`))
    }

    _checkStatus(id) {
        let result = this._data.find(elem => elem.id == id);
        console.log(result);
    }


}


class Storage {
    constructor(key) {
        this._key = key;

        if (typeof this._key !== "string") {
            this._key = this._key.toString();
        }
    }

    setData(data) {

        localStorage.setItem(this._key, JSON.stringify(data));
    }

    getData() {
        return JSON.parse(localStorage.getItem(this._key));
    }
};



class View {
    constructor(todo) {
        this._todo = todo;
        this._htmlElement = document.createElement('div');
        this._htmlElement.id = Date.now();

        this._render = this._render.bind(this);

    }

    /*     view {
            _todo : {
                []
            },
            _htmlElement : ...;
            _htmlElement.id: ..;,
    
            initialize()
        } */

    initialize() {
        this._todo.addEventListener('change', this._render);    // каждый раз получаем уведомление //todo.addEventListener();
        document.body.append(this._htmlElement);            // initialize() вызывается один раз и поэтому пишем его сюда. 
        
        this._render();
    }

    destroy() {
        this._todo.removeEventListener('change', this._render);
        this._htmlElement.remove();
    }


    _render() {                                                  // отрисовать, представить    
        let todoItems = this._todo.getAllItems();                // получаем актуальное состояние элементов
        let todoItemsReadonly = this._todo.isReadonly();         // читаем наше поле для изменения

        let html = '';

        html += `
        <div class="container">
            <div class="header">                                          
                <input type="text" ${todoItemsReadonly ? 'disabled' : ''} id="tagInput_${this._htmlElement.id}" placeholder="Your tagName"> 
                <button id="tagAdd_${this._htmlElement.id}" ${todoItemsReadonly ? 'disabled' : ''}>+</button>
            </div>
            <div id="tags">
                <div id="notification_${this._htmlElement.id}">Tag list</div>
                <ul id="tagsList_${this._htmlElement.id}" class="tagList">`             /* добавить классы!!! и SCC */
        for (let todoItem of todoItems) {
            html += `<li> ${todoItem.text} <button class="close-dagger delete" ${todoItemsReadonly || todoItem.readonly ? 'disabled' : ''}>&#10006</button></li>`
        }
        html += `</ul> 
            </div>
        </div>
        `
        this._htmlElement.innerHTML = html;

        this._subscribeOnUserAction();
    }

    _subscribeOnUserAction() {}  // сюда внести все слушатели событий кнопок инпутов ... 

};

let tagInput = document.querySelector('#tagInput');
let addButton = document.querySelector('#tagAdd');
let tagsList = document.querySelector('#tagsList');



/* let todo = new Todo();
todo.add('попить воды');
todo.add('помыть посуду');
todo.add('нарезать салат');
todo.add('сгонять на рыбалку');

 */


//todo.state();



// getAll вернуть полную копию массива this._data JSON  JavaScript deepCopy()


