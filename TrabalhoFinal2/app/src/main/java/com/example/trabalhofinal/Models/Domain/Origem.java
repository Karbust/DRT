package com.example.trabalhofinal.Models.Domain;

public class Origem {

    private String LOCALIDADE;
    private float LATITUDE;
    private float LONGITUDE;

    public Origem(String LOCALIDADE, float LATITUDE, float LONGITUDE) {
        this.LOCALIDADE = LOCALIDADE;
        this.LATITUDE = LATITUDE;
        this.LONGITUDE = LONGITUDE;
    }

    public String getLOCALIDADE() {
        return LOCALIDADE;
    }

    public float getLATITUDE() {
        return LATITUDE;
    }

    public float getLONGITUDE() {
        return LONGITUDE;
    }

    public void setLOCALIDADE(String LOCALIDADE) {
        this.LOCALIDADE = LOCALIDADE;
    }

    public void setLATITUDE(float LATITUDE) {
        this.LATITUDE = LATITUDE;
    }

    public void setLONGITUDE(float LONGITUDE) {
        this.LONGITUDE = LONGITUDE;
    }
}