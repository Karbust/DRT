package com.example.trabalhofinal.Models.Responses;

import com.example.trabalhofinal.Models.Domain.Viagem;

import java.util.ArrayList;

public class ViagensResponse {

    private boolean success;
    private ArrayList<Viagem> data;

    public ViagensResponse(boolean success) {
        this.success = success;
    }

    public boolean isSuccess() {
        return success;
    }

    public ArrayList<Viagem> getViagens() {
        return data;
    }



}