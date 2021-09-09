
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
        return JSON.parse(JSON.stringify(this._data)); // разрываем ссылку на наш объект
    }

    isReadonly() {
        return this._readonly;
    }

    makeReadonly() { // только для чтения    
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

        localStorage.setItem(this._key, JSON.stringify(data))
    }

    getData() {
        return JSON.parse(localStorage.getItem(this._key))
    }
}

class View {
    constructor(todo) {   // сюда отправляем new Todo(); наш общей объект, текущий объект со всеми свойствами и методами
        this._todo = todo;
        this._htmlElement = document.createElement('div');
        this._htmlElement.id = Date.now();

        this._render = this._render.bind(this);

    }

    /*     view {
            _todo : {
                _data: []
                _readonly : boolean,
                addItem(text),
                removeItem(), 
            },
            
            _htmlElement : ...;
            _htmlElement.id: ..;,
    
            initialize()
        } */

    initialize() {                                            // дейсвие по запуску отрисовки  START 
        this._todo.addEventListener('change', this._render);    // каждый раз получаем уведомление //todo.addEventListener();
        document.body.append(this._htmlElement);            // initialize() вызывается один раз и поэтому пишем его сюда. 

        this._render();

    }

    destroy() {
        this._todo.removeEventListener('change', this._render);  // действие по остановки отрисовки STOP
        this._htmlElement.remove();
    }


    _render() {                                                  // отрисовать, представить    
        let todoItems = this._todo.getAllItems();                // получаем актуальное состояние элементов
        let todoItemsReadonly = this._todo.isReadonly();         // читаем наше поле для изменения

        let html = '';

        html += `
        <div class="container">
            <div class="header">                                          
                <input type="text" id="tagInput_${this._htmlElement.id}" class="tag-input" ${todoItemsReadonly ? 'disabled' : ''} placeholder="Your tag name"> 
                <button id="tagAdd_${this._htmlElement.id}" class="tag-add" ${todoItemsReadonly ? 'disabled' : ''}>+</button>
            </div>
            <div class="tags">
                <span class="notification">Tag list</span>
                <ul id="tagsList_${this._htmlElement.id}" class="tags-list">`             /* добавить классы!!! и SCC */
        for (let todoItem of todoItems) {
            html += `<li id="tagItem_${todoItem.id}"> ${todoItem.text} <button class="close-dagger delete" ${todoItemsReadonly || todoItem.readonly ? 'disabled' : ''}>&#10006</button></li>`
        }
        html += `</ul> 
            </div>
        </div>
        `
        this._htmlElement.innerHTML = html;

        this._subscribeOnUserAction();
    }

    _subscribeOnUserAction() {
        let todoItems = this._todo.getAllItems();
        let button = document.getElementById(`tagAdd_${this._htmlElement.id}`);
        let input = document.getElementById(`tagInput_${this._htmlElement.id}`);

        let that = this;


        button.addEventListener('click', function () {
            let inputText = input.value;   //document.querySelector('.tag-input').value;

            if (!inputText) return;

            let arr = inputText.split(',');

            arr.forEach(elem => {
                that._todo.addItem(elem);
            });

        });

        // почеу не прячем перебор внутрь 'click'? возникает событие, перебираем выполняем действие? 

        todoItems.forEach(todoItem => {
            let li = document.getElementById(`tagItem_${todoItem.id}`);
            let closeButton = li.querySelector('button.close-dagger.delete');

            closeButton.addEventListener('click', function () {

                that._todo.deleteItem(todoItem.id);    // тут this будет кнопка-крестик, a нам надо todo через that
            });
        });

        input.addEventListener('keydown', function (event) {

            let inputText = input.value;   //document.querySelector('.tag-input').value;

            if (!inputText) return;

            if (event.keyCode === 13) {
                let arr = inputText.split(',');

                if (arr.length > 0) {
                    arr.forEach(elem => {
                        that._todo.addItem(elem);
                    });
                }
            }
        });
    }  // сюда внести все слушатели событий кнопок инпутов ... 
};


let storage = new Storage('todoStorage');

let objStorage = storage.getData();

let data = objStorage?.data;

let todo = new Todo(data);
//todo.isReadonly() = objStorage.readonly;   // 

let view = new View(todo);
view.initialize();

todo.addEventListener('change', function () {

    let objForStorage = {
    data : todo.getAllItems(),
    readonly : todo.isReadonly(),
    };
    
    storage.setData(objForStorage);
});






/*
let objForStorage = {
    data: todo.getAllItems(),
    readonly: todo.isReadonly()
};
//console.log(objForStorage.data);

todo.addEventListener('change', function () {
    storage.setData(objForStorage);
});


console.log(objStorage);
console.log(todo.getAllItems());
//console.log(storage.getData());
 */




// добавить код который подписывается на собыите change модели (todo) и записывает данные в объект класса Storage(); 

// идея: каждый раз когда меняется состояние модели всплывает собыите change нашей модли, в этот момент записываем
// обновленне состояние в storage таким образом в storage будут поподать актуальные данные
