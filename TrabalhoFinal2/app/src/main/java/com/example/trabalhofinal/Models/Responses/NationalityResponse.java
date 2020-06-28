package com.example.trabalhofinal.Models.Responses;

import com.example.trabalhofinal.Models.Domain.Nationality;

import java.util.ArrayList;


public class NationalityResponse {
    private boolean success;
    private ArrayList<Nationality> data;

    public NationalityResponse(boolean success) {
        this.success = success;
    }

    public boolean isSuccess() {
        return success;
    }

    public ArrayList<Nationality> getNationalities() {
        return data;
    }
}
