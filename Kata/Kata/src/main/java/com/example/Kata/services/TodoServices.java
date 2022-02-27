package com.example.Kata.services;

import com.example.Kata.model.TodoModel;
import com.example.Kata.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TodoServices {

    @Autowired
    private TodoRepository repository;

    //Trae todos los TodoList
    public Iterable<TodoModel> list(){
        return repository.findAll();
    }

    //Guarda Todolist
    public TodoModel save( TodoModel todo ){
        return repository.save(todo);
    }

    //Borra los TodoList
    public void delete(Long id){
        repository.delete(get(id));
    }

    //Toma por id, si no encuentra nada retorna una expepcion
    public TodoModel get(Long id){
        return repository.findById(id).orElseThrow();
    }
}
