package com.example.trabalhofinal.Adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.trabalhofinal.Models.Domain.Viagem;
import com.example.trabalhofinal.R;
import com.example.trabalhofinal.storage.SharedPrefManager;

import java.util.ArrayList;

public class RecyclerViewAdapterHistorico extends RecyclerView.Adapter {


    public interface OnAvaliarListener{
        void OnAvaliarClick(int position);
    }

    private static final String TAG = "RecyclerViewAdapterHistorico";
    private ArrayList<Viagem> viagens = new ArrayList<>();
    private Context context;
    RecyclerViewAdapterHistorico.OnAvaliarListener onAvaliarListener;
    SharedPrefManager sharedPrefManager;

    public RecyclerViewAdapterHistorico( RecyclerViewAdapterHistorico.OnAvaliarListener onAvaliarListener,Context context) {
        this.onAvaliarListener = onAvaliarListener;
        this.context = context;
        sharedPrefManager = SharedPrefManager.getInstance(context);
    }

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.recyclerview_viagens_historico,parent,false);
        RecyclerView.ViewHolder viewHolder_historico = new ViewHolder_Historico(view ,onAvaliarListener);
        return viewHolder_historico;
    }

    public void setViagens(ArrayList<Viagem> viagens) {
        this.viagens = viagens;
    }

    public Viagem getViagemByPosition(int position) {
        return viagens.get(position);
    }

    @Override
    public int getItemCount() {
        return viagens.size();
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
        if(holder instanceof RecyclerViewAdapterHistorico.ViewHolder_Historico){
            ((RecyclerViewAdapterHistorico.ViewHolder_Historico) holder).origem.setText(viagens.get(position).getNrViagem().getOrigem().getLOCALIDADE());
            ((RecyclerViewAdapterHistorico.ViewHolder_Historico) holder).destino.setText(viagens.get(position).getNrViagem().getDestino().getLOCALIDADE());
            ((RecyclerViewAdapterHistorico.ViewHolder_Historico) holder).data.setText(viagens.get(position).getNrViagem().getDATAHORA_IDA());
        }
    }


    public class ViewHolder_Historico extends RecyclerView.ViewHolder{

        TextView data;
        TextView origem;
        TextView destino;
        Button avaliar;
        RecyclerViewAdapterHistorico.OnAvaliarListener onAvaliarListener;

        public ViewHolder_Historico(@NonNull View itemView, RecyclerViewAdapterHistorico.OnAvaliarListener onAvaliarListener) {

            super(itemView);
            this.onAvaliarListener = onAvaliarListener;
            data = itemView.findViewById(R.id.data_recycle_historico);
            origem = itemView.findViewById(R.id.calde_historico);
            destino = itemView.findViewById(R.id.hospital_historico);
            avaliar = itemView.findViewById(R.id.avaliar);

            View.OnClickListener AvaliarClick = new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    onAvaliarListener.OnAvaliarClick(getAdapterPosition());
                }
            };
            avaliar.setOnClickListener(AvaliarClick);
        }
    }

}
