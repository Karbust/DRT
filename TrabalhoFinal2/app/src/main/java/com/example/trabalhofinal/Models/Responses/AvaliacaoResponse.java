package com.example.trabalhofinal.Models.Responses;

import com.example.trabalhofinal.Models.Domain.Avaliacao;

import java.util.ArrayList;

public class AvaliacaoResponse {

    private boolean success;
    private ArrayList<Avaliacao> data;

    public AvaliacaoResponse(boolean success) {
        this.success = success;
    }

    public boolean isSuccess() {
        return success;
    }

    public ArrayList<Avaliacao> getData() {
        return data;
    }
}
