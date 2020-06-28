package com.example.trabalhofinal.Api;

import com.example.trabalhofinal.Models.Responses.LocationsResponse;
import com.example.trabalhofinal.Models.Responses.LoginResponse;
import com.example.trabalhofinal.Models.Responses.NationalityResponse;
import com.example.trabalhofinal.Models.Responses.ViagensResponse;
import com.example.trabalhofinal.storage.SharedPrefManager;

import java.util.List;
import java.util.Map;

import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Headers;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.Part;
import retrofit2.http.PartMap;

public interface Api {

    @FormUrlEncoded
    @POST("user/loginapp")
    Call<LoginResponse> login(
      @Field("username") String username,
      @Field("password") String password
    );

    @GET("api/localidades")
    Call<LocationsResponse> locations();

    @GET("api/nacionalidades")
    Call<NationalityResponse> nationalities();

    @Multipart
    @POST("user/registarapp")
    Call<ResponseBody> regist(
            @PartMap() Map<String, RequestBody> partMap,
            @Part List<MultipartBody.Part> files
    );


    @FormUrlEncoded
    @POST("/viagens/pedidosviagemmotorista")
    Call<ViagensResponse> viagens(
            @Field("motorista") int motorista,
            @Header("authorization") String key
    );
}


