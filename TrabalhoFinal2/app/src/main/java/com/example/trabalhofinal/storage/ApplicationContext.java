package com.example.trabalhofinal.storage;

import android.app.Application;

import com.example.trabalhofinal.Models.Domain.Location;
import com.example.trabalhofinal.Models.Domain.Stats;
import com.example.trabalhofinal.Models.Domain.Viagem;
import com.example.trabalhofinal.Models.Domain.ViagensMotorista;

import java.util.ArrayList;

public class ApplicationContext extends Application {
    private ArrayList<Location> locations;
    private ArrayList<Viagem> viagens;
    private ArrayList<Stats> stats;
    private ArrayList<ViagensMotorista> viagensMotoristas;


    @Override
    public void onCreate() {
        super.onCreate();
        locations = null;
        viagens=null;
        stats=null;
        viagensMotoristas=null;
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