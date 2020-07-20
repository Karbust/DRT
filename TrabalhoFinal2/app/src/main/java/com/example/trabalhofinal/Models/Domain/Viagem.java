package com.example.trabalhofinal.Models.Domain;

import java.io.Serializable;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import com.example.trabalhofinal.Models.Domain.NrViagem;

public class Viagem implements Serializable {

    private NrViagem NrViagem;

    public Viagem(NrViagem NrViagem) {
        this.NrViagem = NrViagem;
    }

    public void setNrViagem(NrViagem nrViagem) {
        NrViagem = nrViagem;
    }

    public NrViagem getNrViagem() {
        return NrViagem;
    }
}