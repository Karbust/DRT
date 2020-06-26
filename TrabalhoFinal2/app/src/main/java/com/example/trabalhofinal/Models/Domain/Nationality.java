package com.example.trabalhofinal.Models.Domain;

public class Nationality {
    private int NR_PAIS;
    private String NOME;
    private String SIGLA2;
    private String SIGLA3;
    private String CODIGO;

    public Nationality(
            int nr_pais,
            String nome,
            String sigla2,
            String sigla3,
            String codigo
    ) {
        NR_PAIS = nr_pais;
        NOME = nome;
        SIGLA2 = sigla2;
        SIGLA3 = sigla3;
        CODIGO = codigo;
    }

    public int getNR_PAIS() {
        return NR_PAIS;
    }

    public String getNOME() {
        return NOME;
    }

    public String getSIGLA2() {
        return SIGLA2;
    }

    public String getSIGLA3() {
        return SIGLA3;
    }

    public String getCODIGO() {
        return CODIGO;
    }

    @Override
    public String toString() {
        return "<" +
                "NR_Pais=" + this.NR_PAIS +
                " NOME=" + this.NOME +
                " SIGLA2=" + this.SIGLA2 +
                " SIGLA3=" + this.SIGLA3 +
                " CODIGO=" + this.CODIGO
                + " >"
                ;
    }
}
