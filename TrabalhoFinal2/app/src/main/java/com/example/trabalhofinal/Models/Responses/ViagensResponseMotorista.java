package com.example.trabalhofinal.Models.Responses;

import com.example.trabalhofinal.Models.Domain.ViagensMotorista;

import java.io.Serializable;
import java.util.ArrayList;

public class ViagensResponseMotorista  {

    private boolean success;
    private ArrayList<ViagensMotorista> data;

    public ViagensResponseMotorista(boolean success) {
        this.success = success;
    }

    public boolean isSuccess() {
        return success;
    }

    public ArrayList<ViagensMotorista> getViagens() {
        return data;
    }


}
