package com.example.trabalhofinal.Api;

import com.example.trabalhofinal.Models.Responses.LocationsResponse;
import com.example.trabalhofinal.Models.Responses.LoginResponse;
import com.example.trabalhofinal.Models.Responses.StatsResponse;
import com.example.trabalhofinal.Models.Responses.SuccessMessageResponses;
import com.example.trabalhofinal.Models.Responses.ViagensResponse;
import com.example.trabalhofinal.Models.Responses.ViagensResponseMotorista;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
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
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.Part;
import retrofit2.http.PartMap;
import retrofit2.http.Path;

public interface Api {

    @FormUrlEncoded
    @POST("user/loginapp")
    Call<LoginResponse> login(
      @Field("username") String username,
      @Field("password") String password,
      @Field("remember") Boolean remember
    );

    @GET("api/localidades")
    Call<LocationsResponse> locations(
            @Header("authorization") String key
    );

    @Multipart
    @POST("user/registarapp")
    Call<SuccessMessageResponses> regist(
            @PartMap() Map<String, RequestBody> partMap,
            @Part List<MultipartBody.Part> files
    );

    @FormUrlEncoded
    @POST("/viagens/pedidosviagemmotorista")
    Call<ViagensResponseMotorista> viagens(
            @Field("motorista") int motorista,
            @Header("authorization") String key
    );

    @FormUrlEncoded
    @POST("/viagens/pedidosviagemcliente")
    Call<ViagensResponse> viagens_cliente(
            @Field("cliente") int cliente,
            @Header("authorization") String key
    );

    @FormUrlEncoded
    @POST("/viagens/registopedidoviagem")
    Call<ResponseBody> registoviagem(
            @Field("origem") int origem,
            @Field("destino") int destino,
            @Field("motivo") String motivo,
            @Field("nrcliente") int nrcliente,
            @Field("datahora_ida") String datahora_ida,
            @Field("datahora_volta") String datahora_volta,
            @Field("clientes") JSONArray nrclientes,
            @Field("observacoes") String observacoes,
            @Field("distancia") String distancia,
            @Field("duracao") String duracao,
            @Header("authorization") String key
    );

    @FormUrlEncoded
    @POST("/viagens/atualizarestadoviagem")
    Call<ResponseBody> estadoUpdate(
            @Field("nr_viagem") int nr_viagem,
            @Field("estado") String estado,
            @Header("authorization") String key
    );

    @FormUrlEncoded
    @POST("/viagens/historicoviagemmotorista")
    Call<ViagensResponseMotorista> historico_motorista(
            @Field("nr_utilizador") int nr_utilizador,
            @Header("authorization") String key
    );

    @FormUrlEncoded
    @POST("/viagens/historicoviagemcliente")
    Call<ViagensResponse> historico_cliente(
            @Field("nr_utilizador") int nr_utilizador,
            @Header("authorization") String key
    );

    @FormUrlEncoded
    @POST("/viagens/classificacaoviagem")
    Call<SuccessMessageResponses> avaliacao(
            @Field("nr_viagem") int nr_viagem,
            @Field("nr_cliente") int nr_cliente,
            @Field("classificacao") int classificacao,
            @Field("comentario") String comentario,
            @Header("authorization") String key
    );


    @GET("/estatisticas/contadorviagensmotoristames/{motorista}")
    Call<StatsResponse> stats(
            @Path("motorista") int motorista,
            @Header("authorization") String key
    );

}
