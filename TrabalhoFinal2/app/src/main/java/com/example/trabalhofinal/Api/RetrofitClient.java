package com.example.trabalhofinal.Api;

import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.converter.scalars.ScalarsConverterFactory;

public class RetrofitClient {
    private static final String BASE_URL = "https://drt.karbust.me:8443/";
    private static RetrofitClient mInstance;
    private Retrofit retrofit;
    private Retrofit retrofit_google;

    private RetrofitClient(){
        retrofit=new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .addConverterFactory(ScalarsConverterFactory.create())
                .build();
    }

    public static synchronized RetrofitClient getInstance(){
        if(mInstance==null){
            mInstance=new RetrofitClient();
        }
        return mInstance;
    }

    public Api getApi(){
        return retrofit.create(Api.class);
    }
}
