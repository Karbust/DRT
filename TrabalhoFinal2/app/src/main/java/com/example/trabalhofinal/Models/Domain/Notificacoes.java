package com.example.trabalhofinal.Models.Domain;

public class Notificacoes {

    private String CONTEUDO;
    private String createdAt;

    public Notificacoes(String CONTEUDO, String createdAt) {
        this.CONTEUDO = CONTEUDO;
        this.createdAt = createdAt;
    }

    public String getCONTEUDO() {
        return CONTEUDO;
    }

    public void setCONTEUDO(String CONTEUDO) {
        this.CONTEUDO = CONTEUDO;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
