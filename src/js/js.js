'use strict';

let MyForm = (function(){
        let submit;

        function mySubmit(event){
            event.preventDefault();
            return false;
        }

        function init(){
            submit = document.getElementById('Submit');
            submit.addEventListener('click', mySubmit);
        }

        return {
            init: init
        };
    }
)();
MyForm.init();
