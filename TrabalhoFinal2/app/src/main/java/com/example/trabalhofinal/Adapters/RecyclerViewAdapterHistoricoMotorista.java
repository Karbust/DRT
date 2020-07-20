package com.example.trabalhofinal.Adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.trabalhofinal.Models.Domain.ViagensMotorista;
import com.example.trabalhofinal.R;
import com.example.trabalhofinal.storage.SharedPrefManager;

import java.util.ArrayList;

public class RecyclerViewAdapterHistoricoMotorista extends RecyclerView.Adapter{

    public interface OnAvaliarListener{
        void OnAvaliarClick(int position);
    }

    private static final String TAG = "RecyclerViewAdapterHistorico";
    private ArrayList<ViagensMotorista> viagens = new ArrayList<>();
    private Context context;
    RecyclerViewAdapterHistoricoMotorista.OnAvaliarListener onAvaliarListener;
    SharedPrefManager sharedPrefManager;

        public RecyclerViewAdapterHistoricoMotorista( RecyclerViewAdapterHistoricoMotorista.OnAvaliarListener onAvaliarListener,Context context) {
        this.onAvaliarListener = onAvaliarListener;
        this.context = context;
        sharedPrefManager = SharedPrefManager.getInstance(context);
    }

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.recyclerview_viagens_historico,parent,false);
        RecyclerView.ViewHolder viewHolder_historico = new RecyclerViewAdapterHistoricoMotorista.ViewHolder_Historico_Motorista(view ,onAvaliarListener);
        return viewHolder_historico;
    }

    public void setViagens(ArrayList<ViagensMotorista> viagens) {
        this.viagens = viagens;
    }

    public ViagensMotorista getViagemByPosition(int position) {
        return viagens.get(position);
    }

    @Override
    public int getItemCount() {
        return viagens.size();
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
        if(holder instanceof RecyclerViewAdapterHistoricoMotorista.ViewHolder_Historico_Motorista){
            ((RecyclerViewAdapterHistoricoMotorista.ViewHolder_Historico_Motorista) holder).origem.setText(viagens.get(position).getOrigem().getLOCALIDADE());
            ((RecyclerViewAdapterHistoricoMotorista.ViewHolder_Historico_Motorista) holder).destino.setText(viagens.get(position).getDestino().getLOCALIDADE());
            ((RecyclerViewAdapterHistoricoMotorista.ViewHolder_Historico_Motorista) holder).data.setText(viagens.get(position).getDATAHORA_IDA());
        }
    }


    public class ViewHolder_Historico_Motorista extends RecyclerView.ViewHolder{

        TextView data;
        TextView origem;
        TextView destino;
        Button avaliar;
        RecyclerViewAdapterHistoricoMotorista.OnAvaliarListener onAvaliarListener;

        public ViewHolder_Historico_Motorista(@NonNull View itemView, RecyclerViewAdapterHistoricoMotorista.OnAvaliarListener onAvaliarListener) {

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
