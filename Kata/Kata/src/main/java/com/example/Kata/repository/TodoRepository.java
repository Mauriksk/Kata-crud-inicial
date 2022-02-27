package com.example.Kata.repository;

import com.example.Kata.model.TodoModel;
import org.springframework.data.repository.CrudRepository;

//De esta interface conseguimos los metodos de la extencion CrudRepository
public interface TodoRepository extends CrudRepository<TodoModel, Long> {
}
