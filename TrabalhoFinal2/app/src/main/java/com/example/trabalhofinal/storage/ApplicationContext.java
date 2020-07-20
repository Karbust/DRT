package com.example.trabalhofinal.storage;

import android.app.Application;

import com.example.trabalhofinal.Models.Domain.Avaliacao;
import com.example.trabalhofinal.Models.Domain.Divida;
import com.example.trabalhofinal.Models.Domain.Location;
import com.example.trabalhofinal.Models.Domain.Notificacoes;
import com.example.trabalhofinal.Models.Domain.Stats;
import com.example.trabalhofinal.Models.Domain.Viagem;
import com.example.trabalhofinal.Models.Domain.ViagensMotorista;
import com.example.trabalhofinal.Models.Responses.DividaResponse;

import java.util.ArrayList;

public class ApplicationContext extends Application {
    private ArrayList<Location> locations;
    private ArrayList<Viagem> viagens;
    private ArrayList<Stats> stats;
    private ArrayList<ViagensMotorista> viagensMotoristas;
    private ArrayList<Notificacoes> notificacoes;
    private ArrayList<Avaliacao> avaliacaos;
    private DividaResponse dividaResponse;
    private int nrviagens;


    @Override
    public void onCreate() {
        super.onCreate();
        locations = null;
        viagens=null;
        stats=null;
        viagensMotoristas=null;
        notificacoes=null;
        avaliacaos=null;
        dividaResponse=null;
        nrviagens = 0;
    }

    public ArrayList<Location> getLocations() { return locations; }

    public void setLocations(ArrayList<Location> locations) { this.locations = locations; }

    public ArrayList<Viagem> getViagens() { return viagens; }

    public void setViagens(ArrayList<Viagem> viagens) { this.viagens = viagens; }

    public void adicionaViagem(Viagem viagem){
        viagens.add(viagem);
    }

    public ArrayList<Stats> getStats() {
        return stats;
    }

    public void setStats(ArrayList<Stats> stats) {
        this.stats = stats;
    }

    public ArrayList<ViagensMotorista> getViagensMotoristas() {
        return viagensMotoristas;
    }

    public void setViagensMotoristas(ArrayList<ViagensMotorista> viagensMotoristas) {
        this.viagensMotoristas = viagensMotoristas;
    }

    public ArrayList<Notificacoes> getNotificacoes() {
        return notificacoes;
    }

    public void setNotificacoes(ArrayList<Notificacoes> notificacoes) {
        this.notificacoes = notificacoes;
    }

    public ArrayList<Avaliacao> getAvaliacaos() {
        return avaliacaos;
    }

    public void setAvaliacaos(ArrayList<Avaliacao> avaliacaos) {
        this.avaliacaos = avaliacaos;
    }

    public int getNrviagens() {
        return nrviagens;
    }

    public void setNrviagens(int nrviagens) {
        this.nrviagens = nrviagens;
    }

    public DividaResponse getDividaResponse() {
        return dividaResponse;
    }

    public void setDividaResponse(DividaResponse dividaResponse) {
        this.dividaResponse = dividaResponse;
    }


    //    private static final int CACHE_SIZE = 4*1024*1024;
//    private Cache cache;
//
//    @Override
//    public void onCreate() {
//        super.onCreate();
//        //create cache
//        cache=new Cache(CACHE_SIZE);
//    }
//
//    public Cache getCache(){
//        return cache;
//    }
//
//    public class Cache {
//        private LruCache<String, Object> lruCache;
//
//        private Cache(int maxSize) {
//            lruCache = new LruCache<String, Object>(maxSize);
//        }
//
//        public void putObject(String key, Object value){
//            lruCache.put(key, value);
//        }
//
//        public Object getObject(String key){
//            return lruCache.get(key);
//        }
//
//        public Object removeObject(String key) {
//            return lruCache.remove(key);
//        }
//
//        public void clearCache() {
//            lruCache.evictAll();
//        }
//    }
}