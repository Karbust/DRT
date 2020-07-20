package com.example.trabalhofinal.Activities;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.app.ProgressDialog;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;

import com.example.trabalhofinal.Adapters.RecyclerViewAdapter;
import com.example.trabalhofinal.Adapters.RecyclerViewAdapterAvaliacao;
import com.example.trabalhofinal.Api.RetrofitClient;
import com.example.trabalhofinal.Models.Domain.Avaliacao;
import com.example.trabalhofinal.Models.Domain.Destino;
import com.example.trabalhofinal.Models.Domain.NrViagem;
import com.example.trabalhofinal.Models.Domain.Origem;
import com.example.trabalhofinal.Models.Domain.Viagem;
import com.example.trabalhofinal.Models.Domain.ViagensMotorista;
import com.example.trabalhofinal.Models.Responses.AvaliacaoResponse;
import com.example.trabalhofinal.Models.Responses.ViagensResponse;
import com.example.trabalhofinal.R;
import com.example.trabalhofinal.storage.ApplicationContext;
import com.example.trabalhofinal.storage.SharedPrefManager;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;

import retrofit2.Call;
import retrofit2.Response;

public class Avaliacao_viagem extends AppCompatActivity {

    private static final String TAG = "Avaliacao_viagem";
    RecyclerView recyclerView;
    RecyclerViewAdapterAvaliacao recyclerViewAdapter;
    ViagensMotorista viagem;
    private ApplicationContext applicationContext;
    private SharedPrefManager sharedPrefManager;
    ProgressDialog dialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_avaliacao_viagem);
        recyclerView = findViewById(R.id.recycleview_avaliacao_activity);

        applicationContext = (ApplicationContext) getApplicationContext();
        sharedPrefManager=  SharedPrefManager.getInstance(applicationContext);

        viagem = (ViagensMotorista) getIntent().getSerializableExtra("VIAGEM");

        dialog = ProgressDialog.show(Avaliacao_viagem.this, "",
                "Loading. Please wait...", true);

        new FetchAvaliacao().execute();

    }

    public ArrayList<Avaliacao> fetchavaliacao(){

        ArrayList<Avaliacao> avaliacaos;

        String key = sharedPrefManager.getToken();

        Call<AvaliacaoResponse> call = RetrofitClient.getInstance().getApi().ratings(viagem.getNR_VIAGEM_PEDIDO(),key);
        try {
            Response<AvaliacaoResponse> viagensResponse = call.execute();
            if (viagensResponse.body() != null && viagensResponse.isSuccessful()) {

                Log.i(TAG, "Request Successful");
                avaliacaos = viagensResponse.body().getData();
            } else {
                Log.i(TAG, "Request Failed");
                dialog.dismiss();
                avaliacaos=null;
            }
        } catch (IOException e) {
            e.printStackTrace();
            Log.i(TAG, "Request erro");
            Log.i(TAG, "Request failure");
            avaliacaos=null;
        }

        return avaliacaos;

    }

    public ArrayList<Avaliacao> fetchavaliacao_cliente(){

        ArrayList<Avaliacao> avaliacaos;

        String key = sharedPrefManager.getToken();
        int user = sharedPrefManager.getUser();

        Call<AvaliacaoResponse> call = RetrofitClient.getInstance().getApi().ratings_history(user,key);
        try {
            Response<AvaliacaoResponse> viagensResponse = call.execute();
            if (viagensResponse.body() != null && viagensResponse.isSuccessful()) {

                Log.i(TAG, "Request Successful");
                avaliacaos = viagensResponse.body().getData();
            } else {
                Log.i(TAG, "Request Failed");
                dialog.dismiss();
                avaliacaos=null;
            }
        } catch (IOException e) {
            e.printStackTrace();
            Log.i(TAG, "Request erro");
            Log.i(TAG, "Request failure");
            avaliacaos=null;
        }

        return avaliacaos;

    }

    private final class FetchAvaliacao extends AsyncTask<Void, Void, ArrayList<Avaliacao>> {

        @Override
        protected ArrayList<Avaliacao> doInBackground(Void... params) {

            ArrayList<Avaliacao> avaliacaos = new ArrayList<>();

            if(sharedPrefManager.getTipoutilizador() == 5){
                avaliacaos=fetchavaliacao();
            }else if(sharedPrefManager.getTipoutilizador() == 7){
                avaliacaos=fetchavaliacao_cliente();
            }

            if(avaliacaos == null) return null;

            return avaliacaos;
        }

        @Override
        protected void onPostExecute(ArrayList<Avaliacao> result) {
            applicationContext.setAvaliacaos(result);
            recyclerViewAdapter = new RecyclerViewAdapterAvaliacao(result);
            recyclerView.setAdapter(recyclerViewAdapter);
            recyclerView.setLayoutManager(new LinearLayoutManager(Avaliacao_viagem.this));
            dialog.dismiss();
        }
    }
}