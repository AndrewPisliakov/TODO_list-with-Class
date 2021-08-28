
class Todo {
    constructor(data) {
        this._data = data ?? []; // посмотреть ?? 
        this._readonly = false;

        /*        let todo = new Todo();
                let todo = {
                    data: [],
                    readonly: false,
                    add(text) {
                        this._data === todo.data;
                    }
                }
                let todo2 = new Todo();
                let todo2 = {
                    data: [],
                    readonly: false,  
                    add(text) {
                        this._data === todo2.data;
                    }
                } */
    }

    add(text) {
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

        console.log(this._data);
    }

    changeText(id, text) {
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

        console.log(this._data);
    }

    delete(id) {   //  ГОТОВО
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
        console.log(this._data);

    }

    deleteAll() {   //--ГОТОВО--
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
        console.log(this._data);
    }

    getAll() {   //      --ГОТОВО--
        return JSON.parse(JSON.stringify(this._data));
    }

    isReadonly() {
        return this._readonly;
    }

    makeReadonly() { // только для чтения       --ГОТОВО--
        this._readonly == true;
        alert('Список только для чтения');
        console.log(this._data);
    }

    makeItemReadonly(id) {                      // ГОТОВО
        let result = this._data.find(elem => elem.id == id);

        if (result) {
            result.readonly = true;
            alert('Перезапись объекта будет недоступна');
        }

        console.log(this._data);
    }

    makeEditable() {
        this._readonly = false;
        alert('Весь список доступен к редактированию');
        console.log(this._data);
    }

    makeItemEditable(id) { //  ГОТОВО
        let result = this._data.find(elem => elem.id == id);

        if (result) {
            result.readonly = false;
            alert('Объект доступен для изменения.');
        }

        console.log(this._data);
    }

    makeItemCompleted(id) {
        let result = this._data.find(elem => elem.id == id);

        result.completed = true;
        alert('Это дело выполнено!');
        console.log(this._data);
    }

    makeItemUnCompleted(id) {
        let result = this._data.find(elem => elem.id == id);

        result.completed = false;
        alert('Это дело еще не выполнено');
        console.log(this._data);
    }

    _checkStatus(id) {
        let result = this._data.find(elem => elem.id == id);
        console.log(result);
    }

}


/* let todo = new Todo();
todo.add('попить воды');
todo.add('помыть посуду');
todo.add('нарезать салат');
todo.add('сгонять на рыбалку');

 */


//todo.state();



// getAll вернуть полную копию массива this._data JSON  JavaScript deepCopy()
