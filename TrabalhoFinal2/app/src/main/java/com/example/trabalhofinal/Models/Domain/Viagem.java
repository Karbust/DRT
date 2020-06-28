package com.example.trabalhofinal.Models.Domain;

public class Viagem {

    private String DATAHORA_IDA;
    private int DISTANCIA;
    private int DURACAO;
    private int PASSAGEIROS;
    private Origem Origem;
    private Destino Destino;

    public Viagem(String DATAHORA_IDA, int DISTANCIA, int DURACAO,int PASSAGEIROS, Origem Origem, Destino Destino) {
        this.DATAHORA_IDA = DATAHORA_IDA;
        this.DISTANCIA = DISTANCIA;
        this.DURACAO = DURACAO;
        this.PASSAGEIROS = PASSAGEIROS;
        this.Origem = Origem;
        this.Destino = Destino;
    }

    public String getDATAHORA_IDA() {
        return DATAHORA_IDA;
    }

    public int getDISTANCIA() {
        return DISTANCIA;
    }

    public int getDURACAO() {
        return DURACAO;
    }

    public int getPASSAGEIROS() {
        return PASSAGEIROS;
    }

    public Origem getOrigem() {
        return Origem;
    }

    public Destino getDestino() {
        return Destino;
    }

    public void setDATAHORA_IDA(String DATAHORA_IDA) {
        this.DATAHORA_IDA = DATAHORA_IDA;
    }

    public void setDISTANCIA(int DISTANCIA) {
        this.DISTANCIA = DISTANCIA;
    }

    public void setDURACAO(int DURACAO) {
        this.DURACAO = DURACAO;
    }

    public void setPASSAGEIROS(int PASSAGEIROS) {
        this.PASSAGEIROS = PASSAGEIROS;
    }

    public void setOrigem(Origem origem) {
        this.Origem = origem;
    }

    public void setDestino(Destino destino) {
        this.Destino = destino;
    }
}