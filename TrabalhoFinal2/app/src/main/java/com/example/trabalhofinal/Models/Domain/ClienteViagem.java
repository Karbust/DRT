package com.example.trabalhofinal.Models.Domain;

import java.io.Serializable;

public class ClienteViagem implements Serializable {

    private int NR_UTILIZADOR;
    private String NOME_UTILIZADOR;

    public ClienteViagem(int NR_UTILIZADOR, String NOME_UTILIZADOR) {
        this.NR_UTILIZADOR = NR_UTILIZADOR;
        this.NOME_UTILIZADOR = NOME_UTILIZADOR;
    }

    public int getNR_UTILIZADOR() {
        return NR_UTILIZADOR;
    }

    public void setNR_UTILIZADOR(int NR_UTILIZADOR) {
        this.NR_UTILIZADOR = NR_UTILIZADOR;
    }

    public String getNOME_UTILIZADOR() {
        return NOME_UTILIZADOR;
    }

    public void setNOME_UTILIZADOR(String NOME_UTILIZADOR) {
        this.NOME_UTILIZADOR = NOME_UTILIZADOR;
    }
}
