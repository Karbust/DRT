package com.example.trabalhofinal.Models.Responses;

import com.example.trabalhofinal.Models.Domain.Nationality;

import java.util.List;

public class NationalityResponse {
    private boolean success;
    private List<Nationality> nationalities;

    public NationalityResponse(boolean success) {
        this.success = success;
    }

    public boolean isSuccess() {
        return success;
    }

    public List<Nationality> getNationalities() {
        return nationalities;
    }
}
