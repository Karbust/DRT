package com.example.trabalhofinal.Models.Responses;

import com.example.trabalhofinal.Models.Domain.Notificacoes;

import java.util.ArrayList;

import okhttp3.ResponseBody;

public class NotificacoesResponse {

    private boolean success;
    private ArrayList<Notificacoes> data;

    public NotificacoesResponse(boolean success) {
        this.success = success;
    }

    public boolean isSuccess() {
        return success;
    }

    public ArrayList<Notificacoes> getNotificacoes() {
        return data;
    }
}
