package com.example.trabalhofinal.Models.Domain;

import java.io.Serializable;

public class ViagensMotorista implements Serializable {

    private int NR_VIAGEM_PEDIDO;
    private String DATAHORA_IDA;
    private int DISTANCIA;
    private int DURACAO;
    private int PASSAGEIROS;
    private String DATAHORA_VOLTA;
    private String CUSTO;
    private String ESTADO;
    private Origem Origem;
    private Destino Destino;

    public ViagensMotorista(int NR_VIAGEM_PEDIDO, String DATAHORA_IDA, int DISTANCIA, int DURACAO, int PASSAGEIROS, String DATAHORA_VOLTA, String CUSTO, String ESTADO, Origem origem,Destino destino) {
        this.NR_VIAGEM_PEDIDO = NR_VIAGEM_PEDIDO;
        this.DATAHORA_IDA = DATAHORA_IDA;
        this.DISTANCIA = DISTANCIA;
        this.DURACAO = DURACAO;
        this.PASSAGEIROS = PASSAGEIROS;
        this.DATAHORA_VOLTA = DATAHORA_VOLTA;
        this.CUSTO = CUSTO;
        this.ESTADO = ESTADO;
        Origem = origem;
        Destino = destino;
    }

    public String getESTADO() {
        return ESTADO;
    }

    public void setESTADO(String ESTADO) {
        this.ESTADO = ESTADO;
    }

    public int getNR_VIAGEM_PEDIDO() {
        return NR_VIAGEM_PEDIDO;
    }

    public void setNR_VIAGEM_PEDIDO(int NR_VIAGEM_PEDIDO) {
        this.NR_VIAGEM_PEDIDO = NR_VIAGEM_PEDIDO;
    }

    public String getDATAHORA_IDA() {
        return DATAHORA_IDA;
    }

    public void setDATAHORA_IDA(String DATAHORA_IDA) {
        this.DATAHORA_IDA = DATAHORA_IDA;
    }

    public int getDISTANCIA() {
        return DISTANCIA;
    }

    public void setDISTANCIA(int DISTANCIA) {
        this.DISTANCIA = DISTANCIA;
    }

    public int getDURACAO() {
        return DURACAO;
    }

    public void setDURACAO(int DURACAO) {
        this.DURACAO = DURACAO;
    }

    public int getPASSAGEIROS() {
        return PASSAGEIROS;
    }

    public void setPASSAGEIROS(int PASSAGEIROS) {
        this.PASSAGEIROS = PASSAGEIROS;
    }

    public String getDATAHORA_VOLTA() {
        return DATAHORA_VOLTA;
    }

    public void setDATAHORA_VOLTA(String DATAHORA_VOLTA) {
        this.DATAHORA_VOLTA = DATAHORA_VOLTA;
    }

    public String getCUSTO() {
        return CUSTO;
    }

    public void setCUSTO(String CUSTO) {
        this.CUSTO = CUSTO;
    }

    public Origem getOrigem() {
        return Origem;
    }

    public void setOrigem(Origem origem) {
        Origem = origem;
    }

    public Destino getDestino() {
        return Destino;
    }

    public void setDestino(Destino destino) {
        Destino = destino;
    }

    @Override
    public String toString() {
        return DATAHORA_IDA;
    }
}
