package com.example.trabalhofinal.Activities;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import com.example.trabalhofinal.Adapters.RecyclerViewAdapterCheckPassageiros;
import com.example.trabalhofinal.Adapters.RecyclerViewAdapterHistorico;
import com.example.trabalhofinal.Api.RetrofitClient;
import com.example.trabalhofinal.Models.Domain.ViagensMotorista;
import com.example.trabalhofinal.Models.Responses.LoginResponse;
import com.example.trabalhofinal.Models.Responses.RecuperarResponse;
import com.example.trabalhofinal.R;
import com.example.trabalhofinal.storage.ApplicationContext;
import com.example.trabalhofinal.storage.SharedPrefManager;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class Check_Passageiros extends AppCompatActivity implements RecyclerViewAdapterCheckPassageiros.OnFaltouListener, RecyclerViewAdapterCheckPassageiros.OnPresentListener, RecyclerViewAdapterCheckPassageiros.OnPagouListener {

    private static final String TAG = "Check_Passageiros";
    RecyclerView recyclerView;
    RecyclerViewAdapterCheckPassageiros recyclerViewAdapterCheckPassageiros;
    private ApplicationContext applicationContext;
    private SharedPrefManager sharedPrefManager;
    private ViagensMotorista viagem;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_check__passageiros);

        applicationContext = (ApplicationContext) getApplicationContext();
        sharedPrefManager = SharedPrefManager.getInstance(applicationContext);

        viagem = (ViagensMotorista) getIntent().getSerializableExtra("VIAGEM_DETALHES");

        recyclerView = findViewById(R.id.recycleview_check_passageiros);

        recyclerViewAdapterCheckPassageiros = new RecyclerViewAdapterCheckPassageiros(this,this,this,applicationContext);
        recyclerView.setAdapter(recyclerViewAdapterCheckPassageiros);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        recyclerViewAdapterCheckPassageiros.setClienteViagems(viagem);
    }

    public void presenca(String estado,int nr_cliente){

        int nr_viagem = viagem.getNR_VIAGEM_PEDIDO();
        String key = sharedPrefManager.getToken();

        Call<RecuperarResponse> call = RetrofitClient.getInstance().getApi().atualizarestadocliente(nr_viagem, nr_cliente,estado,key);
        Log.i(TAG, "Request enqueue");
        call.enqueue(new Callback<RecuperarResponse>() {

            @Override
            public void onResponse(Call<RecuperarResponse> call, Response<RecuperarResponse> response) {
                RecuperarResponse recuperarResponse = response.body();

                Log.i(TAG, "Request body" + response);
                //Log.i(TAG, "Request body" + response.body().toString());

                if (recuperarResponse != null && recuperarResponse.isSuccess()) {


                    Toast.makeText(getApplicationContext(), recuperarResponse.getMessage(), Toast.LENGTH_LONG).show();

                } else {

                    Toast.makeText(getApplicationContext(), recuperarResponse.getMessage(), Toast.LENGTH_LONG).show();
                    Log.i(TAG, "Request Failed");

                }
            }

            @Override
            public void onFailure(Call<RecuperarResponse> call, Throwable t) {
                Log.i(TAG, "Request erro");
                Log.i(TAG, "Request failure" + t);
            }
        });
    }

    public void pagamento(String estado,int nr_cliente){

        int nr_viagem = viagem.getNR_VIAGEM_PEDIDO();
        String key = sharedPrefManager.getToken();

        Call<RecuperarResponse> call = RetrofitClient.getInstance().getApi().atualizarestadopagamento(nr_viagem, nr_cliente,estado,key);
        Log.i(TAG, "Request enqueue");
        call.enqueue(new Callback<RecuperarResponse>() {

            @Override
            public void onResponse(Call<RecuperarResponse> call, Response<RecuperarResponse> response) {
                RecuperarResponse recuperarResponse = response.body();

                Log.i(TAG, "Request body" + response);
                //Log.i(TAG, "Request body" + response.body().toString());

                if (recuperarResponse != null && recuperarResponse.isSuccess()) {


                    Toast.makeText(getApplicationContext(), recuperarResponse.getMessage(), Toast.LENGTH_LONG).show();

                } else {

                    Toast.makeText(getApplicationContext(), recuperarResponse.getMessage(), Toast.LENGTH_LONG).show();
                    Log.i(TAG, "Request Failed");

                }
            }

            @Override
            public void onFailure(Call<RecuperarResponse> call, Throwable t) {
                Log.i(TAG, "Request erro");
                Log.i(TAG, "Request failure" + t);
            }
        });
    }

    @Override
    public void OnFaltouListener(int position) {
        int nr_cliente = viagem.getViagemclientesviagem().get(position).getClienteViagem().getNR_UTILIZADOR();
        presenca("FALTOU",nr_cliente);
    }

    @Override
    public void OnPresentListener(int position) {
        int nr_cliente = viagem.getViagemclientesviagem().get(position).getClienteViagem().getNR_UTILIZADOR();
        presenca("PRESENTE",nr_cliente);
    }

    @Override
    public void OnPagouListener(int position) {
        int nr_cliente = viagem.getViagemclientesviagem().get(position).getClienteViagem().getNR_UTILIZADOR();
        pagamento("RECEBIDO",nr_cliente);
    }
}