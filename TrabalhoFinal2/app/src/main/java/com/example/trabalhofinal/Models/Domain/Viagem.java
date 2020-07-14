package com.example.trabalhofinal.Models.Domain;

import java.io.Serializable;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import com.example.trabalhofinal.Models.Domain.NrViagem;

public class Viagem implements Serializable {

    private String ESTADO;
    private NrViagem NrViagem;

    public Viagem(String ESTADO,NrViagem NrViagem) {
        this.ESTADO = ESTADO;
        this.NrViagem = NrViagem;
    }

    public void setESTADO(String ESTADO) {
        this.ESTADO = ESTADO;
    }

    public void setNrViagem(NrViagem nrViagem) {
        NrViagem = nrViagem;
    }

    public String getESTADO() { return ESTADO; }

    public NrViagem getNrViagem() {
        return NrViagem;
    }
}