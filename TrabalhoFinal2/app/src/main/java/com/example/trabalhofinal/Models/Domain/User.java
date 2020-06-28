package com.example.trabalhofinal.Models.Domain;

public class User {

    private int nrUser;
    private int tipoUser;
    private String nome;
    private String email;
    private int telemovel;

    public User(String nome, int tipoUser, String email, int telemovel,int nrUser) {
        this.tipoUser = tipoUser;
        this.nome = nome;
        this.email = email;
        this.telemovel = telemovel;
    }

    public String getNome() {
        return nome;
    }

    public int getTipo() {
        return tipoUser;
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

    public void setTipo(int tipoUser) {
        this.tipoUser = tipoUser;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setTelemovel(int telemovel) {
        this.telemovel = telemovel;
    }

    public int getNrUser() {
        return nrUser;
    }

    public void setNrUser(int nrUser) {
        this.nrUser = nrUser;
    }
}