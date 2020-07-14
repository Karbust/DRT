package com.example.trabalhofinal.Activities;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import android.app.ProgressDialog;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Spinner;

import com.example.trabalhofinal.Api.RetrofitClient;
import com.example.trabalhofinal.Models.Domain.Destino;
import com.example.trabalhofinal.Models.Domain.NrViagem;
import com.example.trabalhofinal.Models.Domain.Origem;
import com.example.trabalhofinal.Models.Domain.Viagem;
import com.example.trabalhofinal.Models.Domain.ViagensMotorista;
import com.example.trabalhofinal.Models.Responses.ViagensResponse;
import com.example.trabalhofinal.Models.Responses.ViagensResponseMotorista;
import com.example.trabalhofinal.R;
import com.example.trabalhofinal.Utils.RecyclerViewAdapter;
import com.example.trabalhofinal.storage.ApplicationContext;
import com.example.trabalhofinal.storage.SharedPrefManager;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.stream.Collectors;

import retrofit2.Call;
import retrofit2.Response;

import static android.R.layout.simple_spinner_dropdown_item;
import static android.R.layout.simple_spinner_item;

public class Viagens2 extends AppCompatActivity implements  SwipeRefreshLayout.OnRefreshListener,RecyclerViewAdapter.OnDetalhesListener, AdapterView.OnItemSelectedListener {

    private static final String TAG = "Viagens2:";
    private ApplicationContext applicationContext;
    private SharedPrefManager sharedPrefManager;
    ProgressDialog dialog;
    SwipeRefreshLayout refreshLayout;
    AsyncTask<?, ?, ?> asyncTask;
    private ArrayList<String> origem_recycle = new ArrayList<>();
    private ArrayList<String> destino_recycle = new ArrayList<>();
    private ArrayList<String> datas_recycle = new ArrayList<>();
    private ArrayList<String> date_filter = new ArrayList<>();
    RecyclerView recyclerView;
    RecyclerViewAdapter recyclerViewAdapter;
    Spinner spinner;
    private String data_escolhida;
    ArrayAdapter<String> spinner_adapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_viagens2);
        recyclerView = findViewById(R.id.recycleview);

        Date date = new Date();
        SimpleDateFormat simpleDateFormat= new SimpleDateFormat("dd-MM-yy");
        data_escolhida = simpleDateFormat.format(date);

        refreshLayout = (SwipeRefreshLayout) findViewById(R.id.refresh_layout);
        spinner = findViewById(R.id.spinner5);

        recyclerViewAdapter = new RecyclerViewAdapter(this);
        recyclerView.setAdapter(recyclerViewAdapter);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        applicationContext = (ApplicationContext) getApplicationContext();
        sharedPrefManager = SharedPrefManager.getInstance(applicationContext);

        dialog = ProgressDialog.show(Viagens2.this, "",
                "Loading. Please wait...", true);

        new Fetchviagens().execute();

        spinner_adapter = new ArrayAdapter<String>(this,simple_spinner_item, new ArrayList<>() );
        spinner_adapter.setDropDownViewResource(simple_spinner_dropdown_item);
        spinner.setAdapter(spinner_adapter);

        refreshLayout.setOnRefreshListener(this);
        spinner.setOnItemSelectedListener(this);
    }

    public static String parseDate(String inputDateString, SimpleDateFormat inputDateFormat, SimpleDateFormat outputDateFormat) {
        Date date = null;
        String outputDateString = null;
        try {
            date = inputDateFormat.parse(inputDateString);
            outputDateString = outputDateFormat.format(date);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return outputDateString;
    }
    
    public ArrayList<ViagensMotorista> fetchviagens() {

        int user = sharedPrefManager.getUser();
        String key = sharedPrefManager.getToken();

        ArrayList<ViagensMotorista> viagens;

        Call<ViagensResponseMotorista> call = RetrofitClient.getInstance().getApi().viagens(user, key);
        try {
            Response<ViagensResponseMotorista> viagensResponseMotoristaResponse = call.execute();
            if (viagensResponseMotoristaResponse.body() != null && viagensResponseMotoristaResponse.isSuccessful()) {

                Log.i(TAG, "Request Successful");
                viagens = viagensResponseMotoristaResponse.body().getViagens();
            } else {
                Log.i(TAG, "Request Failed");
                dialog.dismiss();
                viagens=null;
            }
        } catch (IOException e) {
            e.printStackTrace();
            Log.i(TAG, "Request erro");
            Log.i(TAG, "Request failure");
            viagens=null;
        }

        return viagens;
    }

    public ArrayList<Viagem> fetchviagen_historico() {

        int user = sharedPrefManager.getUser();
        String key = sharedPrefManager.getToken();


        ArrayList<Viagem> viagens;

        Call<ViagensResponse> call = RetrofitClient.getInstance().getApi().viagens_cliente(user, key);
        try {
            Response<ViagensResponse> viagensResponse = call.execute();
            if (viagensResponse.body() != null && viagensResponse.isSuccessful()) {

                Log.i(TAG, "Request Successful");
                viagens = viagensResponse.body().getViagens();
            } else {
                Log.i(TAG, "Request Failed");
                dialog.dismiss();
                viagens=null;
            }
        } catch (IOException e) {
            e.printStackTrace();
            Log.i(TAG, "Request erro");
            Log.i(TAG, "Request failure");
            viagens=null;
        }

        return viagens;
    }


    @Override
    public void onRefresh() {
        Log.i(TAG, "onRefresh called from SwipeRefreshLayout");
        dialog = ProgressDialog.show(Viagens2.this, "",
                "Loading. Please wait...", true);
        origem_recycle.clear();
        destino_recycle.clear();
        datas_recycle.clear();
        spinner_adapter.clear();
        date_filter.clear();
        new Fetchviagens().execute();

        // This method performs the actual data-refresh operation.
        // The method calls setRefreshing(false) when it's finished.
    }


    @Override
    public void OnDetalhesClick(int position) {
        Intent intent= new Intent(Viagens2.this,Viagens_Detalhes.class);
        intent.putExtra("VIAGEM_DETALHES", recyclerViewAdapter.getViagemByPosition(position) );
        startActivity(intent);
    }

    @Override
    public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
        switch (parent.getId()){
            case R.id.spinner5:
                data_escolhida = (String) spinner.getSelectedItem();
                ArrayList<Viagem> viagens = applicationContext.getViagens();
                ArrayList<Viagem> viagens_filter = (ArrayList<Viagem>) viagens.stream().filter(viagem -> parseDate(
                        viagem.getNrViagem().getDATAHORA_IDA(),
                        new SimpleDateFormat("dd-MM-yyyy HH:mm"),
                        new SimpleDateFormat("dd-MM-yyyy")).equals(data_escolhida)
                ).collect(Collectors.toList());
                recyclerViewAdapter.setViagens(viagens_filter);
                recyclerViewAdapter.notifyDataSetChanged();
                break;
        }
    }

    @Override
    public void onNothingSelected(AdapterView<?> parent) {

    }

    private final class Fetchviagens extends AsyncTask<Void, Void, ArrayList<Viagem>> {

        @Override
        protected ArrayList<Viagem> doInBackground(Void... params) {

            int user = sharedPrefManager.getTipoutilizador();
            ArrayList<Viagem> viagens = new ArrayList<>();
            ArrayList<ViagensMotorista> viagens_motorista = new ArrayList<>();

            viagens=fetchviagen_historico();


            if(viagens == null) return null;

            ArrayList<Viagem> viagens1 = (ArrayList<Viagem>) viagens.clone();


            for (int i=0 ; i < viagens1.size() ; i++)
            {
                NrViagem var= viagens1.get(i).getNrViagem();
                Viagem var2=viagens1.get(i);
                var.setDATAHORA_IDA(parseDate(var.getDATAHORA_IDA(),new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),new SimpleDateFormat("dd-MM-yyyy HH:mm")));

                if(var.getDATAHORA_VOLTA() != null){
                    var.setDATAHORA_VOLTA(parseDate(var.getDATAHORA_VOLTA(),new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),new SimpleDateFormat("dd-MM-yyyy HH:mm")));
                    Destino destiny = new Destino(var.getOrigem().getLOCALIDADE(),var.getOrigem().getLATITUDE(),var.getOrigem().getLONGITUDE());
                    Origem origin = new Origem(var.getDestino().getLOCALIDADE(),var.getDestino().getLATITUDE(),var.getDestino().getLONGITUDE());
                    NrViagem nrViagem = new NrViagem(var.getNR_VIAGEM_PEDIDO(),var.getDATAHORA_IDA(),var.getDISTANCIA(),var.getDURACAO(),var.getPASSAGEIROS(),null,var.getCUSTO(),origin,destiny);
                    Viagem trip = new Viagem(var2.getESTADO(),nrViagem);
                    viagens.add(trip);
                    if(var2.getESTADO().equals("PENDENTE_VOLTA")){
                        viagens.remove(i);
                    }
                }
            }

            ArrayList<Viagem> viagens2 = (ArrayList<Viagem>) viagens.clone();

            for (Viagem var : viagens2){
                NrViagem nrViagem = var.getNrViagem();
                if(!date_filter.contains(nrViagem.getDATAHORA_IDA())){
                    date_filter.add(parseDate(nrViagem.getDATAHORA_IDA(),new SimpleDateFormat("dd-MM-yyyy HH:mm"),new SimpleDateFormat("dd-MM-yyyy")));
                }
            }

            Collections.sort(viagens, (Viagem o1, Viagem o2) -> {
                NrViagem nrViagem = o1.getNrViagem();
                NrViagem nrViagem1 = o2.getNrViagem();
                try {
                    return new SimpleDateFormat("dd-MM-yyyy").parse(nrViagem.getDATAHORA_IDA()).compareTo(new SimpleDateFormat("dd-MM-yyyy").parse(nrViagem1.getDATAHORA_IDA()));
                }catch (ParseException e){
                    return 0;
                }
            });

            return viagens;
        }

        @Override
        protected void onPostExecute(ArrayList<Viagem> result) {
            applicationContext.setViagens(result);
            if(refreshLayout.isRefreshing()){
                refreshLayout.setRefreshing(false);
            }
            spinner_adapter.addAll(date_filter);
            //spinner_adapter.notifyDataSetChanged();
            dialog.dismiss();
        }
    }
}