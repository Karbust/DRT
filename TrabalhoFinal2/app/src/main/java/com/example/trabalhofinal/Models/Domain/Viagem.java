package com.example.trabalhofinal.Models.Domain;

public class Viagem {

    private String DATAHORA_IDA;
    private int DISTANCIA;
    private int DURACAO;
    private int PASSAGEIROS;
    private String DATAHORA_VOLTA;
    private String CUSTO;
    private Origem Origem;
    private Destino Destino;

    public Viagem(String DATAHORA_IDA, int DISTANCIA, int DURACAO,int PASSAGEIROS, Origem Origem, Destino Destino,String CUSTO,String DATAHORA_VOLTA) {
        this.DATAHORA_IDA = DATAHORA_IDA;
        this.DISTANCIA = DISTANCIA;
        this.DURACAO = DURACAO;
        this.PASSAGEIROS = PASSAGEIROS;
        this.DATAHORA_VOLTA=DATAHORA_VOLTA;
        this.CUSTO=CUSTO;
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

    public String getDATAHORA_VOLTA() { return DATAHORA_VOLTA; }

    public String getCUSTO() { return CUSTO; }

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

    public void setDATAHORA_VOLTA(String DATAHORA_VOLTA) { this.DATAHORA_VOLTA = DATAHORA_VOLTA; }

    public void setCUSTO(String CUSTO) { this.CUSTO = CUSTO; }

    public void setOrigem(Origem origem) {
        this.Origem = origem;
    }

    public void setDestino(Destino destino) {
        this.Destino = destino;
    }
}