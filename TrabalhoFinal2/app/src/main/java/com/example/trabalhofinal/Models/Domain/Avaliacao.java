package com.example.trabalhofinal.Models.Domain;

public class Avaliacao {

    private int CLASSIFICACAO;
    private String COMENTARIO;

    public Avaliacao(int CLASSIFICACAO, String COMENTARIO) {
        this.CLASSIFICACAO = CLASSIFICACAO;
        this.COMENTARIO = COMENTARIO;
    }

    public int getCLASSIFICACAO() {
        return CLASSIFICACAO;
    }

    public void setCLASSIFICACAO(int CLASSIFICACAO) {
        this.CLASSIFICACAO = CLASSIFICACAO;
    }

    public String getCOMENTARIO() {
        return COMENTARIO;
    }

    public void setCOMENTARIO(String COMENTARIO) {
        this.COMENTARIO = COMENTARIO;
    }
}
