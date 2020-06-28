package com.example.trabalhofinal.storage;

import android.app.Application;
import android.util.LruCache;

import androidx.constraintlayout.solver.Cache;

public class ApplicationContext extends Application {

    private static final int CACHE_SIZE = 4*1024*1024;
    private Cache cache;

    @Override
    public void onCreate() {
        super.onCreate();
        //create cache
        cache=new Cache(CACHE_SIZE);
    }

    public Cache getCache(){
        return cache;
    }

    public class Cache {
        private LruCache<String, Object> lruCache;

        private Cache(int maxSize) {
            lruCache = new LruCache<String, Object>(maxSize);
        }

        public void putObject(String key, Object value){
            lruCache.put(key, value);
        }

        public Object getObject(String key){
            return lruCache.get(key);
        }

        public Object removeObject(String key) {
            return lruCache.remove(key);
        }

        public void clearCache() {
            lruCache.evictAll();
        }

        /*
        @Override
        protected int sizeOf(String key, Object value) {
            return value.getByteCount();
        }
         */

    }
}

