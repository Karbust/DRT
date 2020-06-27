package com.example.trabalhofinal.Models.Domain;

public class User {

    private String nome;
    private String email;
    private int tipouser;
    private int telemovel;

    public User(String nome, String email, int tipouser, int telemovel) {
        this.nome = nome;
        this.email = email;
        this.tipouser = tipouser;
        this.telemovel = telemovel;
    }

    public int getTipouser() {
        return tipouser;
    }

    public int getTelemovel() {
        return telemovel;
    }

    public String getNome() {
        return nome;
    }

    public String getEmail() {
        return email;
    }
}
