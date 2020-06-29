package com.example.trabalhofinal.Models.Domain;

public class Location {
    private    int NR_LOCALIDADE;
    private String LOCALIDADE;
    private int TARIFA;
    private String COD_POSTAL;
    private float LATITUDE;
    private float LONGITUDE;
    private boolean ATIVO;

    public Location(
            int nr_localidade,
            String localidade,
            int tarifa,
            String cod_postal,
            float latitude,
            float longitude,
            boolean ativo
    ) {
        NR_LOCALIDADE = nr_localidade;
        LOCALIDADE = localidade;
        TARIFA = tarifa;
        COD_POSTAL = cod_postal;
        LATITUDE = latitude;
        LONGITUDE = longitude;
        ATIVO = ativo;
    }

    public int getNR_LOCALIDADE() {
        return NR_LOCALIDADE;
    }

    public String getLOCALIDADE() {
        return LOCALIDADE;
    }

    public int getTARIFA() {
        return TARIFA;
    }

    public String getCOD_POSTAL() {
        return COD_POSTAL;
    }

    public float getLATITUDE() {
        return LATITUDE;
    }

    public float getLONGITUDE() {
        return LONGITUDE;
    }

    public boolean isATIVO() {
        return ATIVO;
    }

    @Override
    public String toString() {
        return LOCALIDADE;
    }
}
