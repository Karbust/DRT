package com.example.trabalhofinal.storage;

import android.app.Application;

import com.example.trabalhofinal.Models.Domain.Location;
import com.example.trabalhofinal.Models.Domain.Nationality;
import com.example.trabalhofinal.Models.Domain.Viagem;

import java.util.ArrayList;

public class ApplicationContext extends Application {
    private ArrayList<Location> locations;
    private ArrayList<Nationality> nationalities;
    private ArrayList<Viagem> viagens;


    @Override
    public void onCreate() {
        super.onCreate();
        locations = null;
        nationalities=null;
        viagens=null;
    }

    public ArrayList<Location> getLocations() { return locations; }

    public void setLocations(ArrayList<Location> locations) { this.locations = locations; }

    public ArrayList<Nationality> getNationalities() { return nationalities; }

    public void setNationalities(ArrayList<Nationality> nationalities) { this.nationalities = nationalities; }

    public ArrayList<Viagem> getViagens() { return viagens; }

    public void setViagens(ArrayList<Viagem> viagens) { this.viagens = viagens; }



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