package com.example.trabalhofinal.storage;

import android.content.Context;
import android.content.SharedPreferences;

public class SharedPrefManager {

    private static String SHARED_PREF_NAME="my_shared_preff";

    private static SharedPreferences preferences;
    private Context mCtx;
    private static SharedPreferences.Editor editor;
    private static final String TOKEN="token";
    private static SharedPrefManager mInstance;


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

    public void saveToken(String token){
        editor.putString(TOKEN,token);
        editor.apply();
    }

    public String getToken(){
        return preferences.getString(TOKEN,null);
    }

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
