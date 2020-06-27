package com.example.trabalhofinal.Models.Domain;

public class User {

    private int tipo;
    private String nome;
    private String email;
    private int telemovel;

    public User(String nome, int tipo, String email, int telemovel) {
        this.tipo = tipo;
        this.nome = nome;
        this.email = email;
        this.telemovel = telemovel;
    }

    public String getNome() {
        return nome;
    }

    public int getTipo() {
        return tipo;
    }

    public String getEmail() {
        return email;
    }

    public int getTelemovel() {
        return telemovel;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setTipo(int tipo) {
        this.tipo = tipo;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setTelemovel(int telemovel) {
        this.telemovel = telemovel;
    }
}
