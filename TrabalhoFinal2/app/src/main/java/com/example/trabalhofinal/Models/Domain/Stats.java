package com.example.trabalhofinal.Models.Domain;

public class Stats {
    private String datas;
    private int count;

    public Stats(String datas, int count) {
        this.datas = datas;
        this.count = count;
    }

    public String getDatas() {
        return datas;
    }

    public void setDatas(String datas) {
        this.datas = datas;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }
}
