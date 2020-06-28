package com.example.trabalhofinal.Models.Responses;

import com.example.trabalhofinal.Models.Domain.Location;

import java.util.ArrayList;

public class LocationsResponse {
    private boolean success;
    private ArrayList<Location> data;

    public LocationsResponse(boolean success){
        this.success=success;
    }

    public boolean isSuccess() {
        return success;
    }

    public ArrayList<Location> getLocations() {
        return data;
    }
}

