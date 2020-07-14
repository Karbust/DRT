package com.example.trabalhofinal.Utils;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.trabalhofinal.Models.Domain.Viagem;
import com.example.trabalhofinal.Models.Domain.ViagensMotorista;
import com.example.trabalhofinal.R;

import java.util.ArrayList;

public class RecyclerViewAdapterMotorista extends RecyclerView.Adapter {

    public interface OnDetalhesListener {
        void OnDetalhesClick(int position);
    }

    private static final String TAG = "RecyclerViewAdapter";
    private ArrayList<ViagensMotorista> viagens = new ArrayList<>();
    private Context context;
    RecyclerViewAdapter.OnDetalhesListener onDetalhesListener;

    public RecyclerViewAdapterMotorista(RecyclerViewAdapter.OnDetalhesListener onDetalhesListener) {
        this.onDetalhesListener = onDetalhesListener;
    }

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.recycleview_viagens,parent,false);
        RecyclerView.ViewHolder viewHolder = new RecyclerViewAdapterMotorista.ViewHolder_Motorista(view , onDetalhesListener);
        return viewHolder;
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
        if(holder instanceof RecyclerViewAdapterMotorista.ViewHolder_Motorista){
            ((RecyclerViewAdapterMotorista.ViewHolder_Motorista) holder).origem.setText(viagens.get(position).getOrigem().getLOCALIDADE());
            ((RecyclerViewAdapterMotorista.ViewHolder_Motorista) holder).destino.setText(viagens.get(position).getDestino().getLOCALIDADE());
            ((RecyclerViewAdapterMotorista.ViewHolder_Motorista) holder).data.setText(viagens.get(position).getDATAHORA_IDA());
        }
    }


    public class ViewHolder_Motorista extends RecyclerView.ViewHolder{

        TextView data;
        TextView origem;
        TextView destino;
        Button detalhes;
        RecyclerViewAdapter.OnDetalhesListener onDetalhesListener;


        public ViewHolder_Motorista(@NonNull View itemView, RecyclerViewAdapter.OnDetalhesListener onDetalhesListener) {

            super(itemView);
            this.onDetalhesListener = onDetalhesListener;
            data = itemView.findViewById(R.id.data_recycle);
            origem = itemView.findViewById(R.id.calde);
            destino = itemView.findViewById(R.id.hospital);
            detalhes = itemView.findViewById(R.id.detalhes);


            View.OnClickListener detalhesClick = new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    onDetalhesListener.OnDetalhesClick(getAdapterPosition());
                }
            };
            detalhes.setOnClickListener(detalhesClick);
        }
    }

}
