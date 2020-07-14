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
import com.example.trabalhofinal.Models.Responses.SuccessMessageResponses;
import com.example.trabalhofinal.Models.Responses.ViagensResponse;
import com.example.trabalhofinal.R;
import com.example.trabalhofinal.Utils.DialogCallback;
import com.example.trabalhofinal.Utils.GlobalUtils;
import com.example.trabalhofinal.Utils.RecyclerViewAdapterHistorico;
import com.example.trabalhofinal.storage.ApplicationContext;
import com.example.trabalhofinal.storage.SharedPrefManager;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.stream.Collectors;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import static android.R.layout.simple_spinner_dropdown_item;
import static android.R.layout.simple_spinner_item;

public class Historico extends AppCompatActivity implements SwipeRefreshLayout.OnRefreshListener, AdapterView.OnItemSelectedListener,RecyclerViewAdapterHistorico.OnAvaliarListener {

    private static final String TAG = "Historico";
    private ApplicationContext applicationContext;
    private SharedPrefManager sharedPrefManager;
    ProgressDialog dialog;
    SwipeRefreshLayout refreshLayout;
    AsyncTask<?, ?, ?> asyncTask;
    private ArrayList<String> origem_recycle = new ArrayList<>();
    private ArrayList<String> destino_recycle = new ArrayList<>();
    private ArrayList<String> datas_recycle = new ArrayList<>();
    private ArrayList<String> date_filter = new ArrayList<>();
    RecyclerView recyclerViewHistorico;
    RecyclerViewAdapterHistorico recyclerViewAdapterHistorico;
    Spinner spinner;
    private String data_escolhida;
    ArrayAdapter<String> spinner_adapter;
    Viagem viagem_avaliada;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_historico);

        recyclerViewHistorico = findViewById(R.id.recycleview_historico);

        Date date = new Date();
        SimpleDateFormat simpleDateFormat= new SimpleDateFormat("dd-MM-yy");
        data_escolhida = simpleDateFormat.format(date);

        refreshLayout = (SwipeRefreshLayout) findViewById(R.id.refresh_layout_historico);
        spinner = findViewById(R.id.spinner6);

        recyclerViewAdapterHistorico = new RecyclerViewAdapterHistorico(this,applicationContext);
        recyclerViewHistorico.setAdapter(recyclerViewAdapterHistorico);
        recyclerViewHistorico.setLayoutManager(new LinearLayoutManager(this));

        applicationContext = (ApplicationContext) getApplicationContext();
        sharedPrefManager = SharedPrefManager.getInstance(applicationContext);

        dialog = ProgressDialog.show(Historico.this, "",
                "Loading. Please wait...", true);

        new Fetchviagens().execute();

        spinner_adapter = new ArrayAdapter<String>(this,simple_spinner_item, new ArrayList<>() );
        spinner_adapter.setDropDownViewResource(simple_spinner_dropdown_item);
        spinner.setAdapter(spinner_adapter);

        refreshLayout.setOnRefreshListener(this);
        spinner.setOnItemSelectedListener(this);
    }

    public void avaliar(int rating){
        int nr_viagem = viagem_avaliada.getNrViagem().getNR_VIAGEM_PEDIDO();
        String key = sharedPrefManager.getToken();
        int nr_cliente = sharedPrefManager.getUser();
        String comentario = null;

        Call<SuccessMessageResponses> call = RetrofitClient.getInstance().getApi().avaliacao(nr_viagem,nr_cliente,rating, null,key);
        Log.i(TAG, "Request enqueue");
        call.enqueue(new Callback<SuccessMessageResponses>() {
            @Override
            public void onResponse(Call<SuccessMessageResponses> call, Response<SuccessMessageResponses> response) {
                Log.i(TAG, "Request body" + response);
                if (response.body() != null && response.isSuccessful()) {

                } else {

                }
            }

            @Override
            public void onFailure(Call<SuccessMessageResponses> call, Throwable t) {
                Log.i(TAG, "Request erro");
                Log.i(TAG, "Request failure" + t);
            }
        });
    }

    public void showDialog(View view){
        GlobalUtils.showDialog(this, new DialogCallback() {
            @Override
            public void callback(int ratings) {
                avaliar(ratings);
            }
        });
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

    public ArrayList<Viagem> fetchviagens_historico_cliente() {

        int user = sharedPrefManager.getUser();
        String key = sharedPrefManager.getToken();


        ArrayList<Viagem> viagens;

        Call<ViagensResponse> call = RetrofitClient.getInstance().getApi().historico_cliente(user, key);
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
        dialog = ProgressDialog.show(Historico.this, "",
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
    public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
        switch (parent.getId()){
            case R.id.spinner6:
                data_escolhida = (String) spinner.getSelectedItem();
                ArrayList<Viagem> viagens = applicationContext.getViagens();
                ArrayList<Viagem> viagens_filter = (ArrayList<Viagem>) viagens.stream().filter(viagem -> parseDate(
                        viagem.getNrViagem().getDATAHORA_IDA(),
                        new SimpleDateFormat("dd-MM-yyyy HH:mm"),
                        new SimpleDateFormat("dd-MM-yyyy")).equals(data_escolhida)
                ).collect(Collectors.toList());
                recyclerViewAdapterHistorico.setViagens(viagens_filter);
                recyclerViewAdapterHistorico.notifyDataSetChanged();
                break;
        }
    }

    @Override
    public void onNothingSelected(AdapterView<?> parent) {

    }

    @Override
    public void OnAvaliarClick(int position) {
        viagem_avaliada = recyclerViewAdapterHistorico.getViagemByPosition(position);
        showDialog(recyclerViewHistorico);
    }


    private final class Fetchviagens extends AsyncTask<Void, Void, ArrayList<Viagem>> {

        @Override
        protected ArrayList<Viagem> doInBackground(Void... params) {
            ArrayList<Viagem> viagens = new ArrayList<>();

            viagens=fetchviagens_historico_cliente();


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
                }
            }

            ArrayList<Viagem> viagens2 = (ArrayList<Viagem>) viagens.clone();

            for (Viagem var : viagens2){
                NrViagem nrViagem = var.getNrViagem();
                if(!date_filter.contains(nrViagem.getDATAHORA_IDA())){
                    date_filter.add(parseDate(nrViagem.getDATAHORA_IDA(),new SimpleDateFormat("dd-MM-yyyy HH:mm"),new SimpleDateFormat("dd-MM-yyyy")));
                }
            }

            Collections.sort(viagens, (o1, o2) -> {
                        NrViagem nrViagem = o1.getNrViagem();
                        NrViagem nrViagem1 = o2.getNrViagem();
                        try {
                            return new SimpleDateFormat("dd-MM-yyyy").parse(nrViagem.getDATAHORA_IDA()).compareTo(new SimpleDateFormat("dd-MM-yyyy").parse(nrViagem1.getDATAHORA_IDA()));
                        } catch (ParseException e) {
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