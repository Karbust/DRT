package com.example.trabalhofinal.Api;

import com.example.trabalhofinal.Models.LocationsResponse;
import com.example.trabalhofinal.Models.LoginResponse;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.GET;
import retrofit2.http.POST;

public interface Api {

    @FormUrlEncoded
    @POST("user/login")
    Call<LoginResponse> login(
      @Field("username") String username,
      @Field("password") String password
    );

    @GET("api/localidades")
    Call<LocationsResponse> locations(
    );



}
