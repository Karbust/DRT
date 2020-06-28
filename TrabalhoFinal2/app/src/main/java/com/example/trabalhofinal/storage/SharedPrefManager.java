package com.example.trabalhofinal.storage;

import android.content.Context;
import android.content.SharedPreferences;

import com.example.trabalhofinal.Models.Domain.User;

public class SharedPrefManager {


    private static String SHARED_PREF_NAME="my_shared_preff";

    private static SharedPreferences preferences;
    private Context mCtx;
    private static SharedPreferences.Editor editor;
    private static final String TOKEN="token";
    private static SharedPrefManager mInstance;
    private static final String NOME="nome";
    private static final String TIPOUTILIZADOR="tipoutilizador";
    private static final String EMAIL="email";
    private static final String TELEMOVEL="telemovel";

    private SharedPrefManager(Context mCtx) {
        this.mCtx = mCtx;
        preferences= mCtx.getSharedPreferences(SHARED_PREF_NAME,Context.MODE_PRIVATE);
        editor=preferences.edit();
    }

    public static synchronized SharedPrefManager getInstance(Context mCtx){
        if(mInstance == null){
            mInstance=new SharedPrefManager(mCtx);
        }
        return  mInstance;
    }

    public void saveSession(String token,User user){
        editor.putString(TOKEN,token);
        editor.putString(NOME,user.getNome());
        editor.putInt(TIPOUTILIZADOR,user.getTipo());
        editor.putString(EMAIL,user.getEmail());
        editor.putInt(TELEMOVEL,user.getTelemovel());
        editor.commit();
    }

    public String getToken(){
        return preferences.getString(TOKEN,null);
    }

    public String getNome(){
        return preferences.getString(NOME,null);
    }

    public int getTipoutilizador(){ return preferences.getInt(TIPOUTILIZADOR,-1); }

    public String getEmail(){
        return preferences.getString(EMAIL,null);
    }

    public int getTelemovel(){ return preferences.getInt(TELEMOVEL,-1); }

    public boolean isLoggedIn(){
        if(getToken()!=null){
            return true;
        }
        return false;
    }

    public void clearSession(){
        editor.remove(TOKEN);
        editor.commit();
    }

}
