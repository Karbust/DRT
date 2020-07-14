package com.example.trabalhofinal.Models.Responses;

import com.example.trabalhofinal.Models.Domain.Stats;

import java.util.ArrayList;

public class StatsResponse {

    private boolean success;
    private ArrayList<Stats> data;

    public StatsResponse(boolean success) {
        this.success = success;
    }

    public boolean isSuccess() {
        return success;
    }

    public ArrayList<Stats> getData() {
        return data;
    }
}
