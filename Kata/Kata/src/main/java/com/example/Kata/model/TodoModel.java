package com.example.Kata.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class TodoModel {
    //Genera id automticamente
    @Id
    @GeneratedValue
    private Long id;
    private String name;
    private boolean isCompleting;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isCompleting() {
        return isCompleting;
    }

    public void setCompleting(boolean completing) {
        isCompleting = completing;
    }
}
