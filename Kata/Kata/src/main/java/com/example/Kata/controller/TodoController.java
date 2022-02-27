package com.example.Kata.controller;

import com.example.Kata.model.TodoModel;
import com.example.Kata.services.TodoServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class TodoController {

    @Autowired
    private TodoServices services;

    //Trae todos los TodoList
    @GetMapping(value = "api/todos")
    public Iterable<TodoModel> list(){
        return services.list();
    }

    //Guarda Todolist
    @PostMapping(value = "api/todo")
    public TodoModel save(@RequestBody TodoModel todo ){
        return services.save(todo);
    }

    //Actualizar
    @PutMapping(value = "api/todo")
    public TodoModel update(@RequestBody TodoModel todo ){
        if( todo.getId() != null ){
            return services.save(todo);
        }
        throw new RuntimeException("El id del todo seleccionado no existe");
    }

    //Borra los TodoList
    @DeleteMapping(value = "api/{id}/todo")
    public void delete(@PathVariable("id") Long id){
        services.delete(id);
    }

    //Toma por id, si no encuentra nada retorna una excepcion
    @GetMapping(value = "api/{id}/todo")
    public TodoModel get(@PathVariable("id") Long id){
        return services.get(id);
    }

}
