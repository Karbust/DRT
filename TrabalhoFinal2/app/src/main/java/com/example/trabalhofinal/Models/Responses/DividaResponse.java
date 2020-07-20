package com.example.trabalhofinal.Models.Responses;

import com.example.trabalhofinal.Models.Domain.Avaliacao;
import com.example.trabalhofinal.Models.Domain.Divida;

import java.util.ArrayList;

public class DividaResponse {

    private boolean success;
    private boolean dividas;
    private ArrayList<Divida> data;

    public DividaResponse(boolean success, boolean divida, ArrayList<Divida> data) {
        this.success = success;
        this.dividas = divida;
        this.data = data;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public boolean isDivida() {
        return dividas;
    }

    public void setDivida(boolean divida) {
        this.dividas = divida;
    }

    public ArrayList<Divida> getData() {
        return data;
    }

    public void setData(ArrayList<Divida> data) {
        this.data = data;
    }
}
